import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { userId: user.user_id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        { userId: user.user_id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, token) => {
    await pool.query(
        'INSERT INTO RefreshToken (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))',
        [userId, token]
    );
};

const verifyToken = (token, secret) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
};

export { generateTokens, storeRefreshToken, verifyToken };