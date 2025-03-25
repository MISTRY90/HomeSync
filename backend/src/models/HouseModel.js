import pool from '../config/db.js';

export const createHouse = async (adminUserId, name, description, timezone = 'UTC') => {
    const [result] = await pool.query(
        `INSERT INTO House 
        (admin_user_id, name, description, timezone) 
        VALUES (?, ?, ?, ?)`,
        [adminUserId, name, description, timezone]
    );
    return result.insertId;
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