// models/SecurityModel.js
import pool from '../config/db.js';

export const logSecurityEvent = async (deviceId, eventType) => {
  const [result] = await pool.query(
    'INSERT INTO SecurityEvent (device_id, event_type) VALUES (?, ?)',
    [deviceId, eventType]
  );
  return result.insertId;
};

export const getSecurityLogsByHouse = async (houseId) => {
  const [logs] = await pool.query(
    `SELECT se.*, d.name AS device_name, dt.name AS device_type 
     FROM SecurityEvent se
     JOIN Device d ON se.device_id = d.device_id
     JOIN DeviceType dt ON d.type_id = dt.type_id
     JOIN Room r ON d.room_id = r.room_id
     WHERE r.house_id = ?`,
    [houseId]
  );
  return logs;
};

export const validateDeviceInHouse = async (deviceId, houseId) => {
  const [device] = await pool.query(
    `SELECT d.device_id 
     FROM Device d 
     JOIN Room r ON d.room_id = r.room_id 
     WHERE d.device_id = ? AND r.house_id = ?`,
    [deviceId, houseId]
  );
  return device.length > 0;
};