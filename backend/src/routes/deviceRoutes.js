// src/routes/deviceRoutes.js
import express from 'express';
import { 
    registerDeviceController, 
    updateDeviceStateController,
    listDevicesController,
    listDeviceTypesController,
    deleteDeviceController
} from '../controllers/deviceController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { checkPermission, PermissionTypes } from '../middleware/rbacMiddleware.js';

const router = express.Router();

// Get device types (no houseId needed)
router.get('/types', authenticate, listDeviceTypesController);

// List devices in a house (houseId in URL param)
router.get('/:houseId', 
    authenticate, 
    checkPermission([PermissionTypes.DEVICE_MANAGEMENT.VIEW]), 
    listDevicesController
);

// Register a new device (houseId in body)
router.post('/houses/:houseId/register', 
    authenticate, 
    checkPermission([PermissionTypes.DEVICE_MANAGEMENT.CREATE]), 
    registerDeviceController
);

// Update device state (houseId in body)
router.put('/houses/:houseId/state', 
    authenticate, 
    checkPermission([PermissionTypes.DEVICE_MANAGEMENT.UPDATE]), 
    updateDeviceStateController
);

// Delete a device (houseId and deviceId in URL params)
router.delete('/houses/:houseId/:deviceId', 
    authenticate, 
    checkPermission([PermissionTypes.DEVICE_MANAGEMENT.DELETE]),
    deleteDeviceController
);

export default router;