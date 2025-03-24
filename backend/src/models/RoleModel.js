import pool from '../config/db.js';

export default class Role {
  static async create(houseId, name, permissions) {
    await pool.query(
      'INSERT INTO Role (house_id, name, permissions) VALUES (?, ?, ?)',
      [houseId, name, JSON.stringify(permissions)]
    );
  }

  static async createDefaultRoles(houseId) {
    const defaultRoles = [
      { name: 'Admin', permissions: { all: true } },
      { name: 'Regular', permissions: { control_devices: true } },
      { name: 'Guest', permissions: { view_devices: true } }
    ];

    for (const role of defaultRoles) {
      await this.create(houseId, role.name, role.permissions);
    }
  }

  static async getByName(houseId, roleName) {
    const [roles] = await pool.query(
      'SELECT * FROM Role WHERE house_id = ? AND name = ?',
      [houseId, roleName]
    );
    return roles[0];
  }
}