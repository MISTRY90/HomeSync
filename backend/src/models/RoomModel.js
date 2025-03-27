import pool from '../config/db.js';

export const createRoom = async (houseId, name, size = null, energyConsumptionLimit = null) => {
    const [result] = await pool.query(
        `INSERT INTO Room 
        (house_id, name, size, energy_consumption_limit) 
        VALUES (?, ?, ?, ?)`,
        [houseId, name, size, energyConsumptionLimit]
    );
    return result.insertId;
};

export const deleteRoom = async (roomId, houseId) => {
    const [result] = await pool.query(
      'DELETE FROM Room WHERE room_id = ? AND house_id = ?',
      [roomId, houseId]
    );
    return result.affectedRows;
  };
  