import express from 'express';
import { createRoomController } from '../controllers/roomController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { isHouseAdmin } from '../middleware/isAdmin.js';

const router = express.Router();

// POST /api/houses/:houseId/rooms
router.post('/:houseId/rooms', authenticate, isHouseAdmin, createRoomController);
export default router;