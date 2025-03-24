import express from 'express';
import { registerUser, loginUser, verifyMFA, refreshToken } from '../controllers/authController.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/mfa-verify', verifyMFA);
router.post('/refresh-token', refreshToken);

export default router;