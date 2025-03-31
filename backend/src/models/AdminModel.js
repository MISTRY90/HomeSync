import pool from '../config/db.js';

// User Management
export const inviteUserToHouse = async (houseId, email, roleId) => {
  const [user] = await pool.query('SELECT user_id FROM User WHERE email = ?', [email]);
  if (!user.length) throw new Error('User not found');
  
  await pool.query(
    'INSERT INTO UserHouse (user_id, house_id, role_id) VALUES (?, ?, ?)',
    [user[0].user_id, houseId, roleId]
  );
};

export const updateUserRole = async (houseId, userId, roleId) => {
    // Validate user exists in the house
    const [userHouse] = await pool.query(
      'SELECT * FROM UserHouse WHERE user_id = ? AND house_id = ?',
      [userId, houseId]
    );
    if (!userHouse.length) throw new Error('User not found in this house');
  
    // Validate role exists
    const [role] = await pool.query(
      'SELECT * FROM Role WHERE role_id = ? AND house_id = ?',
      [roleId, houseId]
    );
    if (!role.length) throw new Error('Role not found');
  
    // Update role
    await pool.query(
      'UPDATE UserHouse SET role_id = ? WHERE user_id = ? AND house_id = ?',
      [roleId, userId, houseId]
    );
  };

  
// Role Management
export const createCustomRole = async (houseId, name, permissions) => {
  const [result] = await pool.query(
    'INSERT INTO Role (house_id, name, permissions) VALUES (?, ?, ?)',
    [houseId, name, JSON.stringify(permissions)]
  );
  return result.insertId;
};

// Dashboard Stats
export const getHouseInsights = async (houseId) => {
  const [stats] = await pool.query(`
    SELECT 
      (SELECT COUNT(*) FROM Device WHERE house_id = ?) AS total_devices,
      (SELECT SUM(consumption) FROM EnergyUsage WHERE device_id IN 
        (SELECT device_id FROM Device WHERE house_id = ?)) AS total_energy,
      (SELECT COUNT(*) FROM SecurityEvent WHERE device_id IN 
        (SELECT device_id FROM Device WHERE house_id = ?)) AS security_events,
      (SELECT COUNT(*) FROM AccessLog al 
        JOIN Device d ON al.device_id = d.device_id
        JOIN Room r ON d.room_id = r.room_id
        WHERE r.house_id = ?) AS access_events,
      (SELECT COUNT(DISTINCT user_id) FROM AccessLog al
        JOIN Device d ON al.device_id = d.device_id
        JOIN Room r ON d.room_id = r.room_id
        WHERE r.house_id = ? AND al.timestamp >= NOW() - INTERVAL 7 DAY) AS active_users_week
  `, [houseId, houseId, houseId, houseId, houseId]);
  
  return stats[0];
};

// Add this function to AdminModel.js
export const getHouseActivityLogs = async (houseId, limit = 100) => {
  const [logs] = await pool.query(`
    SELECT al.*, u.name as user_name, u.email, 
           d.name as device_name, dt.name as device_type,
           r.name as room_name
    FROM AccessLog al
    JOIN Device d ON al.device_id = d.device_id
    JOIN DeviceType dt ON d.type_id = dt.type_id
    JOIN Room r ON d.room_id = r.room_id
    LEFT JOIN User u ON al.user_id = u.user_id
    WHERE r.house_id = ?
    ORDER BY al.timestamp DESC
    LIMIT ?
  `, [houseId, limit]);
  
  return logs;
};

// Add this function to AdminModel.js
export const getFilteredActivityLogs = async (houseId, filters = {}) => {
  let query = `
    SELECT al.*, u.name as user_name, u.email, 
           d.name as device_name, dt.name as device_type,
           r.name as room_name
    FROM AccessLog al
    JOIN Device d ON al.device_id = d.device_id
    JOIN DeviceType dt ON d.type_id = dt.type_id
    JOIN Room r ON d.room_id = r.room_id
    LEFT JOIN User u ON al.user_id = u.user_id
    WHERE r.house_id = ?
  `;
  
  const queryParams = [houseId];
  
  // Add filters
  if (filters.userId) {
    query += ' AND al.user_id = ?';
    queryParams.push(filters.userId);
  }
  
  if (filters.deviceId) {
    query += ' AND al.device_id = ?';
    queryParams.push(filters.deviceId);
  }
  
  if (filters.roomId) {
    query += ' AND r.room_id = ?';
    queryParams.push(filters.roomId);
  }
  
  if (filters.action) {
    query += ' AND al.action LIKE ?';
    queryParams.push(`%${filters.action}%`);
  }
  
  if (filters.startDate) {
    query += ' AND al.timestamp >= ?';
    queryParams.push(filters.startDate);
  }
  
  if (filters.endDate) {
    query += ' AND al.timestamp <= ?';
    queryParams.push(filters.endDate);
  }
  
  // Add sorting and limit
  query += ' ORDER BY al.timestamp DESC LIMIT ?';
  queryParams.push(filters.limit || 100);
  
  const [logs] = await pool.query(query, queryParams);
  return logs;
};

// Add this function to AdminModel.js
export const getActivityLogsSummary = async (houseId) => {
  // Get activity by user
  const [userActivity] = await pool.query(`
    SELECT u.name as user_name, COUNT(*) as action_count
    FROM AccessLog al
    JOIN Device d ON al.device_id = d.device_id
    JOIN Room r ON d.room_id = r.room_id
    JOIN User u ON al.user_id = u.user_id
    WHERE r.house_id = ? AND al.timestamp >= NOW() - INTERVAL 30 DAY
    GROUP BY al.user_id
    ORDER BY action_count DESC
    LIMIT 5
  `, [houseId]);
  
  // Get activity by device
  const [deviceActivity] = await pool.query(`
    SELECT d.name as device_name, COUNT(*) as action_count
    FROM AccessLog al
    JOIN Device d ON al.device_id = d.device_id
    JOIN Room r ON d.room_id = r.room_id
    WHERE r.house_id = ? AND al.timestamp >= NOW() - INTERVAL 30 DAY
    GROUP BY al.device_id
    ORDER BY action_count DESC
    LIMIT 5
  `, [houseId]);
  
  // Get activity by room
  const [roomActivity] = await pool.query(`
    SELECT r.name as room_name, COUNT(*) as action_count
    FROM AccessLog al
    JOIN Device d ON al.device_id = d.device_id
    JOIN Room r ON d.room_id = r.room_id
    WHERE r.house_id = ? AND al.timestamp >= NOW() - INTERVAL 30 DAY
    GROUP BY r.room_id
    ORDER BY action_count DESC
    LIMIT 5
  `, [houseId]);
  
  return {
    userActivity,
    deviceActivity,
    roomActivity
  };
};