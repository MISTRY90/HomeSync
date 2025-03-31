import pool from '../config/db.js';

export const isHouseAdmin = async (req, res, next) => {
    const { houseId } = req.params;
    const userId = req.user.userId;
  
    try {
      const [house] = await pool.query(
        'SELECT house_id FROM House WHERE admin_user_id = ? AND house_id = ?',
        [userId, houseId]
      );
  
      if (!house.length) {
        return res.status(403).json({ error: 'Admin access required' });
      }
      
      req.houseId = houseId; // Make houseId available downstream
      next();
    } catch (error) {
      console.error('Admin check error:', error);
      res.status(500).json({ error: 'Admin verification failed' });
    }
  };