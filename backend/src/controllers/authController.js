import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import { createUser } from '../models/UserModel.js';
// import { sendVerificationEmail } from '../utils/email.js';
import { generateTokens, storeRefreshToken } from '../utils/jwt.js';
import { verifyMfaCode } from '../utils/otp.js';



const register = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        // Check if email exists
        const [existing] = await pool.query(
            'SELECT * FROM User WHERE email = ?', 
            [email]
        );
        if (existing.length) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Create basic user
        const passwordHash = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            `INSERT INTO User 
            (email, password_hash, name, status) 
            VALUES (?, ?, ?, 'active')`,
            [email, passwordHash, name]
        );

        res.status(201).json({
            message: 'User registered successfully',
            userId: result.insertId
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};


const verifyEmail = async (req, res) => {
  const { token } = req.body;

  try {
      const verified = await verifyUser(token);
      
      if (!verified) {
          return res.status(400).json({ error: 'Invalid or expired verification token' });
      }

      res.json({ message: 'Email verified successfully' });
  } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({ error: 'Email verification failed' });
  }
};

const login = async (req, res) => {
    const { email, password, mfaCode } = req.body;
    
    // 1. Verify credentials
    const [users] = await pool.query('SELECT * FROM User WHERE email = ?', [email]);
    const user = users[0];
    
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 2. Check MFA for admins
    if (user.mfa_secret) {
        if (!mfaCode) return res.status(401).json({ error: 'MFA required' });
        if (!verifyMfaCode(user.mfa_secret, mfaCode)) {
            return res.status(401).json({ error: 'Invalid MFA code' });
        }
    }

    // 3. Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);
    await storeRefreshToken(user.user_id, refreshToken);

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ accessToken, userId: user.user_id });
};

const refresh = async (req, res) => {
    const { userId } = req.user;
    const [users] = await pool.query('SELECT * FROM User WHERE user_id = ?', [userId]);
    const user = users[0];
    
    const { accessToken, refreshToken } = generateTokens(user);
    await storeRefreshToken(user.user_id, refreshToken);

    res.cookie('refreshToken', refreshToken, { 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ accessToken });
};

const logout = async (req, res) => {
    const { refreshToken } = req.cookies;
    await pool.query('DELETE FROM RefreshToken WHERE token = ?', [refreshToken]);
    res.clearCookie('refreshToken');
    res.sendStatus(204);
};

export { login, refresh, logout, verifyEmail ,register };