// routes/securityRoutes.js
import express from 'express';
import { 
  logSecurityEventController, 
  getSecurityLogsController 
} from '../controllers/securityController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { checkPermission, PermissionTypes } from '../middleware/rbacMiddleware.js';

const router = express.Router();

// Log security events for a house (requires security logging permission)
router.post(
  '/houses/:houseId/security-events',
  authenticate,
  checkPermission([PermissionTypes.SECURITY_MANAGEMENT.LOG]),
  logSecurityEventController
);

router.get(
  '/houses/:houseId/security-events',
  authenticate,
  checkPermission([PermissionTypes.SECURITY_MANAGEMENT.VIEW]),
  getSecurityLogsController
);

export default router;