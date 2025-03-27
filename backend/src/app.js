// src/app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mqttManager from "./utils/mqtt.js";
import winston from "winston";
import authRoutes from "./routes/authRoutes.js";
import usersRouter from "./routes/userRoutes.js";
import houseRouter from "./routes/houseRoutes.js";
import roomRouter from "./routes/roomRoutes.js";
import deviceRoutes from "./routes/deviceRoutes.js"

// Configure global error handling
process.on("unhandledRejection", (reason, promise) => {
  winston.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  winston.error("Uncaught Exception:", error);
  // Gracefully shut down
  mqttManager.disconnect();
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
    app.use(morgan("combined"));
    // Routes
    app.use("/api/auth", authRoutes);
    app.use("/api", usersRouter);

    //house , room Routes
    app.use("/api/houses", houseRouter);
    app.use("/api/houses", roomRouter);

    //device Routes
    app.use("/api/devices", deviceRoutes);

    //connect to mqtt Broker

    // Health check endpoint
    app.get("/health", (req, res) => {
      res.status(200).json({ status: "OK" });
    });

    mqttManager.connect();

    // Start server
    const server = app.listen(port, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${port}`
      );
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      console.log("SIGTERM received. Shutting down gracefully");
      server.close(() => {
        mqttManager.disconnect();
        process.exit(0);
      });
    });

    return server;
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

// Start the server
startServer();
