import pool from '../config/db.js';

export default class RefreshToken {
  static async create(userId, token) {
    await pool.query(
      'INSERT INTO RefreshToken (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))',
      [userId, token]
    );
  }

  static async findValidToken(userId, token) {
    const [tokens] = await pool.query(
      'SELECT * FROM RefreshToken WHERE user_id = ? AND token = ? AND expires_at > NOW()',
      [userId, token]
    );
    return tokens[0];
  }
}
