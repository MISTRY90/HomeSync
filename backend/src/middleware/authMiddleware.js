import { verifyToken } from '../utils/jwt.js';

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = verifyToken(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(401).json({ error: 'Invalid token' });

    req.user = { userId: decoded.userId, email: decoded.email };
    next();
};

const checkRefreshToken = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
    if (!decoded) return res.status(401).json({ error: 'Invalid refresh token' });

    const [tokens] = await pool.query(
        'SELECT * FROM RefreshToken WHERE user_id = ? AND token = ?',
        [decoded.userId, refreshToken]
    );
    
    if (!tokens.length) return res.status(401).json({ error: 'Token revoked' });
    req.user = { userId: decoded.userId };
    next();
};

export { authenticate, checkRefreshToken };