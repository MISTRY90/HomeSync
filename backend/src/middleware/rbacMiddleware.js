export const checkPermission = (requiredPermission) => async (req, res, next) => {
  try {
    const [userRole] = await pool.query(
      `SELECT r.permissions 
       FROM UserHouse uh
       JOIN Role r ON uh.role_id = r.role_id
       WHERE uh.user_id = ? AND uh.house_id = ?`,
      [req.user.user_id, req.params.houseId]
    );

    const permissions = JSON.parse(userRole[0].permissions);
    if (!permissions[requiredPermission]) {
      throw new Error('Insufficient permissions');
    }
    
    next();
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};