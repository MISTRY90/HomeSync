import express from 'express';
import { createHouseController } from '../controllers/houseController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { isHouseAdmin } from '../middleware/rbacMiddleware.js';

const router = express.Router();

// Create new house
router.post('/', authenticate, createHouseController);

// Example admin-only route
router.post('/:houseId/rooms', authenticate, isHouseAdmin, createHouseController);

export default router;