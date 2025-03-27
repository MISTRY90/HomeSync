import pool from '../config/db.js';

// Predefined permission types for more granular access control
const PERMISSION_TYPES = {
    DEVICE_MANAGEMENT: {
        VIEW: 'device_view',
        CREATE: 'device_create',
        UPDATE: 'device_update',
        DELETE: 'device_delete'
    },
    ROOM_MANAGEMENT: {
        VIEW: 'room_view',
        CREATE: 'room_create',
        UPDATE: 'room_update',
        DELETE: 'room_delete'
    },
    USER_MANAGEMENT: {
        VIEW: 'user_view',
        INVITE: 'user_invite',
        UPDATE_ROLE: 'user_role_update',
        REMOVE: 'user_remove'
    }
};

// Enhanced permission check middleware
export const checkPermission = (requiredPermissions) => {
    return async (req, res, next) => {
        // Get houseId from both params and body
        const houseId = req.params.houseId || req.body.houseId;
        
        if (!houseId) {
            return res.status(400).json({
                error: 'House ID required',
                details: 'Provide houseId in either URL parameters or request body'
            });
        }
        
        const userId = req.user.userId;

        try {
            // 1. Check if user is house admin (full access)
            const [adminCheck] = await pool.query(
                'SELECT house_id FROM House WHERE admin_user_id = ? AND house_id = ?',
                [userId, houseId]
            );

            if (adminCheck.length > 0) {
                req.isAdmin = true;
                return next();
            }

            // 2. Check user's specific permissions
            const [userPermissions] = await pool.query(`
                SELECT r.permissions
                FROM UserHouse uh
                JOIN Role r ON uh.role_id = r.role_id
                WHERE uh.user_id = ? AND uh.house_id = ?
            `, [userId, houseId]);

            // No role found for this house
            if (!userPermissions.length) {
                return res.status(403).json({ 
                    error: 'Access Denied',
                    details: 'No role assigned for this house' 
                });
            }

            // Parse and validate permissions
            const parsedPermissions = JSON.parse(userPermissions[0].permissions);
            
            // Check if all required permissions are present
            const missingPermissions = requiredPermissions.filter(
                perm => !parsedPermissions[perm]
            );

            if (missingPermissions.length > 0) {
                return res.status(403).json({ 
                    error: 'Insufficient Permissions',
                    missingPermissions 
                });
            }

            next();
        } catch (error) {
            console.error('Permission check error:', error);
            res.status(500).json({ 
                error: 'Permission verification failed',
                details: error.message 
            });
        }
    };
};


export const isHouseAdmin = async (req, res, next) => {
    const { houseId } = req.params;
    const userId = req.user.userId;

    const [house] = await pool.query(
        'SELECT house_id FROM House WHERE admin_user_id = ? AND house_id = ?',
        [userId, houseId]
    );
    
    if (!house.length) {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

export const PermissionTypes = PERMISSION_TYPES;