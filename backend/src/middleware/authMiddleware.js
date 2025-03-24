import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

export const authenticateJWT = (requiredRoles = [], requiredPermissions = []) => {
  return async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) return res.status(401).send('Access denied');

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.getUserWithPermissions(decoded.user_id);

      if (!user) return res.status(401).send('Invalid user');
      
      req.user = user;
      
      if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
        return res.status(403).send('Insufficient privileges');
      }

      const permissions = JSON.parse(user.permissions);
      if (requiredPermissions.some(perm => !permissions[perm])) {
        return res.status(403).send('Missing required permissions');
      }

      next();
    } catch (err) {
      res.status(401).send('Invalid token');
    }
  };
};