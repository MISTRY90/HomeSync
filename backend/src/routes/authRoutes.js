import express from 'express';
import AuthController from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh-token', AuthController.refreshToken);

// Protected routes (require authentication)
router.post('/enable-mfa', authMiddleware, AuthController.enableMFA);
router.post('/verify-mfa', authMiddleware, AuthController.verifyMFA);

export default router;