import pool from '../config/db.js';
import logger from '../utils/logger.js';

export const logUserAction = async (userId, deviceId, action) => {
  try {
    const [result] = await pool.query(
      'INSERT INTO AccessLog (user_id, device_id, action) VALUES (?, ?, ?)',
      [userId, deviceId, action]
    );
    return result.insertId;
  } catch (error) {
    logger.error('Failed to log user action', { 
      error: error.message, 
      userId, 
      deviceId, 
      action 
    });
    throw error;
  }
};

export const getDeviceAccessHistory = async (deviceId, limit = 100) => {
  const [logs] = await pool.query(
    `SELECT al.*, u.name as user_name, u.email 
     FROM AccessLog al
     LEFT JOIN User u ON al.user_id = u.user_id
     WHERE al.device_id = ?
     ORDER BY al.timestamp DESC
     LIMIT ?`,
    [deviceId, limit]
  );
  return logs;
};

export const getUserActivityHistory = async (userId, limit = 100) => {
  const [logs] = await pool.query(
    `SELECT al.*, d.name as device_name, dt.name as device_type
     FROM AccessLog al
     JOIN Device d ON al.device_id = d.device_id
     JOIN DeviceType dt ON d.type_id = dt.type_id
     WHERE al.user_id = ?
     ORDER BY al.timestamp DESC
     LIMIT ?`,
    [userId, limit]
  );
  return logs;
};

export const getHouseActivityLogs = async (houseId, limit = 100) => {
  const [logs] = await pool.query(
    `SELECT al.*, u.name as user_name, d.name as device_name, 
            r.name as room_name, dt.name as device_type
     FROM AccessLog al
     JOIN Device d ON al.device_id = d.device_id
     JOIN Room r ON d.room_id = r.room_id
     LEFT JOIN User u ON al.user_id = u.user_id
     JOIN DeviceType dt ON d.type_id = dt.type_id
     WHERE r.house_id = ?
     ORDER BY al.timestamp DESC
     LIMIT ?`,
    [houseId, limit]
  );
  return logs;
}; 