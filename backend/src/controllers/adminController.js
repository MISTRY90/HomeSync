import House from '../models/HouseModel.js';
import Role from '../models/RoleModel.js';

export const createHouse = async (req, res) => {
    try {
      const { name, timezone } = req.body;
      const adminId = req.user.user_id;
  
      // Verify user has admin role in at least one house
      const [roles] = await pool.query(
        `SELECT r.* FROM UserHouse uh
         JOIN Role r ON uh.role_id = r.role_id
         WHERE uh.user_id = ? AND r.name = 'Admin'`,
        [adminId]
      );
  
      if (roles.length === 0) {
        return res.status(403).send('Admin privileges required');
      }
  
      const houseId = await House.create(adminId, name, timezone);
      await Role.createDefaultRoles(houseId);
  
      // Assign admin role to creator
      const adminRole = await Role.getByName(houseId, 'Admin');
      await UserHouse.assign(adminId, houseId, adminRole.role_id);
  
      res.status(201).json({ houseId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };