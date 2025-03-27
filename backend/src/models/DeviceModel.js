// src/models/DeviceModel.js
import pool from '../config/db.js';

export const createDevice = async (houseId, roomId, typeId, uniqueIdentifier, name, initialState = null) => {
    const [result] = await pool.query(
        `INSERT INTO Device 
        (house_id, room_id, type_id, unique_identifier, name, current_state) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [houseId, roomId, typeId, uniqueIdentifier, name, JSON.stringify(initialState)]
    );
    return result.insertId;
};

export const updateDeviceState = async (deviceId, newState) => {
    const [result] = await pool.query(
        `UPDATE Device 
        SET current_state = ? 
        WHERE device_id = ?`,
        [JSON.stringify(newState), deviceId]
    );
    return result.affectedRows > 0;
};

export const getDevicesByHouse = async (houseId) => {
    const [devices] = await pool.query(
        `SELECT d.*, dt.name as type_name, dt.attributes, r.name as room_name 
        FROM Device d
        JOIN DeviceType dt ON d.type_id = dt.type_id
        JOIN Room r ON d.room_id = r.room_id
        WHERE d.house_id = ?`,
        [houseId]
    );
    return devices;
};

export const getDeviceTypes = async () => {
    const [types] = await pool.query('SELECT * FROM DeviceType');
    return types;
};

export const deleteDevice = async (deviceId, houseId) => {
    const [result] = await pool.query(
        `DELETE FROM Device 
        WHERE device_id = ? 
        AND house_id = ?`,
        [deviceId, houseId]
    );
    return result.affectedRows > 0;
};