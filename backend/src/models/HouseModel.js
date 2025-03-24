import pool from '../config/db.js';

export default class House {
  static async create(adminId, name, timezone = 'UTC') {
    const [result] = await pool.query(
      'INSERT INTO House (admin_user_id, name, timezone) VALUES (?, ?, ?)',
      [adminId, name, timezone]
    );
    return result.insertId;
  }
  static async count() {
    const [result] = await pool.query('SELECT COUNT(*) AS count FROM House');
    return result[0].count;
  }
  
}
