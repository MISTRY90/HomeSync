import pool from '../config/db.js';

export const recordEnergyUsage = async (deviceId, consumption) => {
  await pool.query(
    'INSERT INTO EnergyUsage (device_id, consumption) VALUES (?, ?)',
    [deviceId, consumption]
  );
};

export const getDeviceEnergyUsage = async (deviceId, period = 'day') => {
  const intervals = {
    day: '1 DAY',
    week: '1 WEEK',
    month: '1 MONTH',
    year: '1 YEAR'
  };
  
  const [results] = await pool.query(`
    SELECT 
      DATE(timestamp) AS date,
      SUM(consumption) AS total_consumption
    FROM EnergyUsage
    WHERE device_id = ?
      AND timestamp >= NOW() - INTERVAL ${intervals[period]}
    GROUP BY DATE(timestamp)
    ORDER BY date ASC
  `, [deviceId]);

  return results;
};

export const getRoomEnergyUsage = async (roomId, period = 'day') => {
    const intervals = {
      day: '1 DAY',
      week: '1 WEEK',
      month: '1 MONTH'
    };
  
    const [results] = await pool.query(`
      SELECT 
        DATE(e.timestamp) AS date,
        SUM(e.consumption) AS total_consumption
      FROM EnergyUsage e
      JOIN Device d ON e.device_id = d.device_id
      WHERE d.room_id = ?
        AND e.timestamp >= NOW() - INTERVAL ${intervals[period]}
      GROUP BY DATE(e.timestamp)
      ORDER BY date ASC
    `, [roomId]);
  
    return results;
  };
  
  export const getHouseEnergyUsage = async (houseId, period = 'day') => {
    const intervals = {
      day: '1 DAY',
      week: '1 WEEK',
      month: '1 MONTH'
    };
  
    const [results] = await pool.query(`
      SELECT 
        DATE(e.timestamp) AS date,
        SUM(e.consumption) AS total_consumption
      FROM EnergyUsage e
      JOIN Device d ON e.device_id = d.device_id
      JOIN Room r ON d.room_id = r.room_id
      WHERE r.house_id = ?
        AND e.timestamp >= NOW() - INTERVAL ${intervals[period]}
      GROUP BY DATE(e.timestamp)
      ORDER BY date ASC
    `, [houseId]);
  
    return results;
  };

// Add these new functions for detailed analytics
export const getEnergySummary = async (houseId) => {
  const [result] = await pool.query(`
    SELECT 
      dt.name AS device_type,
      SUM(e.consumption) AS total_consumption,
      COUNT(DISTINCT d.device_id) AS device_count
    FROM EnergyUsage e
    JOIN Device d ON e.device_id = d.device_id
    JOIN DeviceType dt ON d.type_id = dt.type_id
    JOIN Room r ON d.room_id = r.room_id
    WHERE r.house_id = ?
      AND e.timestamp >= NOW() - INTERVAL 1 MONTH
    GROUP BY dt.name
  `, [houseId]);

  return result;
};

export const getPeakUsageTimes = async (houseId) => {
  const [result] = await pool.query(`
    SELECT 
      HOUR(timestamp) AS hour,
      SUM(consumption) AS total_consumption
    FROM EnergyUsage e
    JOIN Device d ON e.device_id = d.device_id
    JOIN Room r ON d.room_id = r.room_id
    WHERE r.house_id = ?
      AND e.timestamp >= NOW() - INTERVAL 1 MONTH
    GROUP BY HOUR(timestamp)
    ORDER BY total_consumption DESC
    LIMIT 5
  `, [houseId]);

  return result;
};