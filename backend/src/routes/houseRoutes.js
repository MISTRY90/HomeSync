import express from 'express';
import { createHouseController,deleteHouseController, getHousesByUserController } from '../controllers/houseController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { isHouseAdmin } from '../middleware/rbacMiddleware.js';

const router = express.Router();

// Create new smart home
router.post('/', authenticate, createHouseController);


// DELETE house (admin only)
router.delete('/:houseId', authenticate, isHouseAdmin, deleteHouseController);

// Fetch houses of a particular user
router.get('/user-houses/:userId', authenticate, getHousesByUserController);

export default router;