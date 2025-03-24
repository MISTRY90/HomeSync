import pool from '../config/db.js';

export default class User {
  static async findByEmail(email) {
    const [users] = await pool.query('SELECT * FROM User WHERE email = ?', [email]);
    return users[0];
  }

  static async findById(userId) {
    const [users] = await pool.query('SELECT * FROM User WHERE user_id = ?', [userId]);
    return users[0];
  }

  static async create(email, passwordHash, name) {
    const [result] = await pool.query(
      'INSERT INTO User (email, password_hash, name) VALUES (?, ?, ?)',
      [email, passwordHash, name]
    );
    return result.insertId;
  }

  static async getUserWithPermissions(userId) {
    const [users] = await pool.query(
      `SELECT u.*, r.permissions 
       FROM User u
       JOIN UserHouse uh ON u.user_id = uh.user_id
       JOIN Role r ON uh.role_id = r.role_id
       WHERE u.user_id = ?`,
      [userId]
    );
    return users[0];
  }

  static async updateMfaSecret(userId, secret) {
    await pool.query(
      'UPDATE User SET mfa_secret = ? WHERE user_id = ?',
      [secret, userId]
    );
  }
}