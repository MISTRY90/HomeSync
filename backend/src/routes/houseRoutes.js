import express from 'express';
import { createHouseController,deleteHouseController } from '../controllers/houseController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { isHouseAdmin } from '../middleware/rbacMiddleware.js';

const router = express.Router();

// Create new house
router.post('/', authenticate, createHouseController);


// DELETE house (admin only)
router.delete('/:houseId', authenticate, isHouseAdmin, deleteHouseController);

export default router;