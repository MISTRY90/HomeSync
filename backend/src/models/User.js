import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default class User {
  // Find user by email
  static async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM User WHERE email = ?', [email]);
    return rows[0];
  }

  // Create new user (registration)
  static async create({ email, password, name }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO User (email, password_hash, name) VALUES (?, ?, ?)',
      [email, hashedPassword, name]
    );
    return result.insertId;
  }

  // Verify password
  static async verifyPassword(user, password) {
    return bcrypt.compare(password, user.password_hash);
  }

  // Generate JWT tokens
  static generateTokens(user) {
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
  }

  // Enable MFA for admin
  static async enableMFA(userId, secret) {
    await pool.query('UPDATE User SET mfa_secret = ? WHERE user_id = ?', [secret, userId]);
  }
}