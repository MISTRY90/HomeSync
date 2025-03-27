import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { checkPermission, isHouseAdmin } from '../middleware/rbacMiddleware.js';
import { setupMfa, verifyMfa } from '../controllers/mfaController.js';

const router = express.Router();

// MFA Routes
router.post('/mfa/setup', authenticate, setupMfa);
router.post('/mfa/verify', authenticate, verifyMfa);

// User Management
router.put('/users/:userId/roles', 
    authenticate, 
    checkPermission(['manage_users']), // Use new permission check
    async (req, res) => {
        // Implementation for updating user roles
    }
);

// Add example house admin route
router.post('/houses/:houseId/admin-action',
    authenticate,
    isHouseAdmin, // Use house admin check middleware
    (req, res) => {
        res.json({ message: 'Admin action performed' });
    }
);

export default router;