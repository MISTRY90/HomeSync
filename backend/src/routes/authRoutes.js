import express from 'express';
import { register, login, refresh, logout } from '../controllers/authController.js';
import { checkRefreshToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', checkRefreshToken, refresh);
router.post('/logout', checkRefreshToken, logout);

export default router;