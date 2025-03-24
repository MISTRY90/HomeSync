export const requireMFA = async (req, res, next) => {
    const { authorization } = req.headers;
    
    // Extract MFA token from header
    if (!authorization || !authorization.startsWith('MFA ')) {
      return res.status(401).send('MFA required');
    }
  
    const mfaToken = authorization.split(' ')[1];
    
    try {
      const decoded = jwt.verify(mfaToken, process.env.JWT_SECRET);
      const [users] = await pool.query('SELECT * FROM User WHERE user_id = ?', [decoded.user_id]);
      
      if (!users.length || !users[0].mfa_secret) {
        return res.status(401).send('Invalid MFA token');
      }
      
      next();
    } catch (err) {
      res.status(401).send('Invalid MFA token');
    }
  };