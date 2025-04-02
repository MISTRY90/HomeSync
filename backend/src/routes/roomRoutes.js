import express from 'express';
import { createRoomController, deleteRoomController } from '../controllers/roomController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { isHouseAdmin } from '../middleware/isAdmin.js';

const router = express.Router();

// Create new room in a house (admin only)
router.post('/:houseId/rooms', 
  authenticate, 
  isHouseAdmin, 
  createRoomController
);

// DELETE: Delete a room (admin only)
router.delete('/:houseId/rooms/:roomId', authenticate, isHouseAdmin, deleteRoomController);

export default router;
