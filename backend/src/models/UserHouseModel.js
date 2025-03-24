import pool from '../config/db.js';

export default class UserHouse {
  static async assign(userId, houseId, roleId) {
    await pool.query(
      'INSERT INTO UserHouse (user_id, house_id, role_id) VALUES (?, ?, ?)',
      [userId, houseId, roleId]
    );
  }
}