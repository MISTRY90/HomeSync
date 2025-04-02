import express from 'express';
import { 
  getDeviceLogsController, 
  getUserLogsController,
  getHouseLogsController
} from '../controllers/accessLogController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { checkPermission, PermissionTypes } from '../middleware/rbacMiddleware.js';

const router = express.Router();

// Get house access logs (requires security view permission)
router.get('/houses/:houseId/logs',
  authenticate,
  checkPermission([PermissionTypes.SECURITY_MANAGEMENT.VIEW]),
  getHouseLogsController
);

router.get('/devices/:deviceId/logs',
  authenticate,
  checkPermission([PermissionTypes.DEVICE_MANAGEMENT.VIEW]),
  getDeviceLogsController
);

router.get('/users/:userId/logs',
  authenticate,
  checkPermission([PermissionTypes.USER_MANAGEMENT.VIEW]),
  getUserLogsController
);

export default router; 