import express from 'express';
import { 
  createAutomationController,
  getAutomationsController,
  updateAutomationController,
  deleteAutomationController
} from '../controllers/automationController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { checkPermission, PermissionTypes } from '../middleware/rbacMiddleware.js';

const router = express.Router();

router.post('/houses/:houseId/automations',
  authenticate,
  checkPermission([PermissionTypes.AUTOMATION_MANAGEMENT.CREATE]),
  createAutomationController
);

router.get('/houses/:houseId/automations',
  authenticate,
  checkPermission([PermissionTypes.AUTOMATION_MANAGEMENT.VIEW]),
  getAutomationsController
);

router.put('/houses/:houseId/automations/:ruleId', 
    authenticate,
    checkPermission([PermissionTypes.AUTOMATION_MANAGEMENT.UPDATE]),
    updateAutomationController
  );

  router.delete('/houses/:houseId/automations/:ruleId',
    authenticate,
    checkPermission([PermissionTypes.AUTOMATION_MANAGEMENT.DELETE]),
    deleteAutomationController
  );

export default router;