import express from 'express';
import { authenticateJWT } from '../middleware/authMiddleware.js';
import { requireMFA } from '../middleware/adminMiddleware.js';
import { createHouse } from '../controllers/adminController.js';

const router = express.Router();

// Protected admin routes
router.post('/houses', 
  authenticateJWT(['Admin'], ['manage_houses']), 
  requireMFA,
  createHouse
);

export default router;