import express from 'express';
import { 
  logEnergyUsage,
  getDeviceEnergyController,
  getRoomEnergyController,
  getHouseEnergyController,
  getEnergyAnalytics
} from '../controllers/energyController.js';
import { authenticate, getHouseDetails } from '../middleware/authMiddleware.js';
import { checkPermission, PermissionTypes } from '../middleware/rbacMiddleware.js';

const router = express.Router();

// Manual energy logging - now requires houseId
router.post('/houses/:houseId/energy/log',
  authenticate,
  checkPermission([PermissionTypes.ENERGY_ANALYTICS.MANAGE]),
  getHouseDetails,
  logEnergyUsage
);

// Device energy - now includes houseId in path
router.get('/houses/:houseId/devices/:deviceId/energy',
  authenticate,
  checkPermission([PermissionTypes.ENERGY_ANALYTICS.VIEW]),
  getHouseDetails,
  getDeviceEnergyController
);

// Room energy - now includes houseId in path
router.get('/houses/:houseId/rooms/:roomId/energy',
  authenticate,
  checkPermission([PermissionTypes.ENERGY_ANALYTICS.VIEW]),
  getHouseDetails,
  getRoomEnergyController
);

// House energy (existing endpoint remains but with explicit houseId)
router.get('/houses/:houseId/energy',
  authenticate,
  checkPermission([PermissionTypes.ENERGY_ANALYTICS.VIEW]),
  getHouseDetails,
  getHouseEnergyController
);

// Comprehensive analytics
router.get('/houses/:houseId/analytics/energy',
  authenticate,
  checkPermission([PermissionTypes.ENERGY_ANALYTICS.VIEW]),
  getHouseDetails,
  getEnergyAnalytics
);

export default router;