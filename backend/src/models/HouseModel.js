import pool from '../config/db.js';

export const createHouse = async (adminUserId, name, description, timezone = 'UTC') => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Create the house
        const [houseResult] = await connection.query(
            `INSERT INTO House 
            (admin_user_id, name, description, timezone) 
            VALUES (?, ?, ?, ?)`,
            [adminUserId, name, description, timezone]
        );
        const houseId = houseResult.insertId;

        // 2. Create default roles for the house
        await connection.query(
            `INSERT INTO Role (house_id, name, permissions)
            VALUES 
                (?, 'Admin', '{"device_view":1,"device_create":1,"device_update":1,"device_delete":1,"room_view":1,"room_create":1,"room_update":1,"room_delete":1}'),
                (?, 'Member', '{"device_view":1}')`,
            [houseId, houseId]
        );

        // 3. Get the admin role ID
        const [roles] = await connection.query(
            `SELECT role_id FROM Role 
            WHERE house_id = ? AND name = 'Admin'`,
            [houseId]
        );

        // 4. Assign admin role to creator
        await connection.query(
            `INSERT INTO UserHouse (user_id, house_id, role_id)
            VALUES (?, ?, ?)`,
            [adminUserId, houseId, roles[0].role_id]
        );

        await connection.commit();
        return houseId;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export const deleteHouse = async (houseId, adminUserId) => {
    // Only delete if the requester is the admin of the house.
    const [result] = await pool.query(
      'DELETE FROM House WHERE house_id = ? AND admin_user_id = ?',
      [houseId, adminUserId]
    );
    return result.affectedRows;
  };

export const getHouseByAdmin = async (userId) => {
    const [houses] = await pool.query(
        'SELECT * FROM House WHERE admin_user_id = ?',
        [userId]
    );
    return houses[0];
};

export const getHouseByIdAndAdmin = async (userId, houseId) => {
    const [houses] = await pool.query(
        'SELECT * FROM House WHERE admin_user_id = ? AND house_id = ?',
        [userId, houseId]
    );
    return houses[0];
};