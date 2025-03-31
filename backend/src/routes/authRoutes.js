import express from 'express';
import { register, login, refresh, logout } from '../controllers/authController.js';
import { checkRefreshToken } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { registerSchema, loginSchema } from '../validations/authValidation.js';

const router = express.Router();

router.post('/register', 
  validateRequest(registerSchema),
  register
);

router.post('/login',
  validateRequest(loginSchema),
  login
);

router.post('/refresh', checkRefreshToken, refresh);
router.post('/logout', checkRefreshToken, logout);

export default router;