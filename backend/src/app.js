// src/app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import logger from "./utils/logger.js";
import authRoutes from "./routes/authRoutes.js";
import usersRouter from "./routes/userRoutes.js";
import houseRouter from "./routes/houseRoutes.js";
import roomRouter from "./routes/roomRoutes.js";
import deviceRoutes from "./routes/deviceRoutes.js";
import scheduler from "./utils/scheduler.js";
import automationRoutes from "./routes/automationRoutes.js";
import energyRoutes from "./routes/energyRoutes.js";
import securityRoutes from './routes/securityRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import accessLogRoutes from './routes/accessLogRoutes.js';

// Configure global error handling
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection", { reason, promise });
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception", { error });
  // Gracefully shut down
  process.exit(1);
});

// Startup function
const startServer = async () => {
  try {
    // Load environment variables
    dotenv.config();

    // Initialize Express
    const app = express();
    const port = process.env.PORT || 3000;

    // Middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    app.use(helmet());

    // Routes
    app.use("/api/auth", authRoutes);
    app.use("/api", usersRouter);

    //house, room Routes
    app.use("/api/houses", houseRouter);
    app.use("/api/houses", roomRouter);

    //device Routes
    app.use("/api/devices", deviceRoutes);

    // Add automation routes
    app.use("/api", automationRoutes);

    // Add to route configuration (before error handlers)
    app.use("/api", energyRoutes);

    app.use('/api', securityRoutes);

    app.use('/api/admin', adminRoutes);

    app.use("/api", accessLogRoutes);

    // Health check endpoint
    app.get("/health", (req, res) => {
      res.status(200).json({ 
        status: "OK",
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    });

    // Initialize scheduler
    await scheduler.initialize();
    // Start server
    const server = app.listen(port, () => {
      logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      logger.info("SIGTERM received. Shutting down gracefully");
      server.close(() => {
        logger.info("Process terminated");
        process.exit(0);
      });
    });

    return server;
  } catch (error) {
    logger.error("Server startup failed", { error });
    process.exit(1);
  }
};

startServer();