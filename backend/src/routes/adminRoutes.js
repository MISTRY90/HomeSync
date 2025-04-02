import express from 'express';
import {
  inviteUserController,
  createRoleController,
  getDashboardController,
  updateUserRoleController,
  getActivityLogsController,
  exportActivityLogsController
} from '../controllers/adminController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { isHouseAdmin } from '../middleware/isAdmin.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Individual routes with house admin check
router.post('/houses/:houseId/invite', isHouseAdmin, inviteUserController);
router.put('/houses/:houseId/users/:userId/role', isHouseAdmin, updateUserRoleController);
router.post('/houses/:houseId/roles', isHouseAdmin, createRoleController);
router.get('/houses/:houseId/dashboard', isHouseAdmin, getDashboardController);
router.get('/houses/:houseId/activity-logs', isHouseAdmin, getActivityLogsController);
router.get('/houses/:houseId/activity-logs/export', isHouseAdmin, exportActivityLogsController);

// Invite users to house (admin only)
router.post('/invite', isHouseAdmin, inviteUserController);

// Create custom roles (admin only)
router.post('/roles', isHouseAdmin, createRoleController);

// Get admin dashboard data
router.get('/dashboard', isHouseAdmin, getDashboardController);

export default router;