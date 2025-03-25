import pool from '../config/db.js';

export const checkHousePermission = (requiredPermissions) => {
    return async (req, res, next) => {
        const { houseId } = req.params;
        const userId = req.user.userId;

        try {
            // 1. Check if user is house admin
            const [adminCheck] = await pool.query(
                'SELECT house_id FROM House WHERE admin_user_id = ? AND house_id = ?',
                [userId, houseId]
            );
            
            if (adminCheck.length > 0) {
                req.isAdmin = true;
                return next();
            }

            // 2. Check regular user permissions
            const [permissions] = await pool.query(`
                SELECT r.permissions 
                FROM UserHouse uh
                JOIN Role r ON uh.role_id = r.role_id
                WHERE uh.user_id = ? AND uh.house_id = ?
            `, [userId, houseId]);

            if (!permissions.length) {
                return res.status(403).json({ error: 'Not a member of this house' });
            }

            const userPermissions = JSON.parse(permissions[0].permissions);
            const hasAccess = requiredPermissions.every(perm => userPermissions[perm]);
            
            if (!hasAccess) {
                return res.status(403).json({ error: 'Insufficient permissions' });
            }

            next();
        } catch (error) {
            console.error('Permission check error:', error);
            res.status(500).json({ error: 'Permission verification failed' });
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