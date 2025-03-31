import { 
  getDeviceAccessHistory, 
  getUserActivityHistory,
  getHouseActivityLogs
} from '../models/AccessLogModel.js';

export const getDeviceLogsController = async (req, res) => {
  const { deviceId } = req.params;
  const { limit = 100 } = req.query;
  
  try {
    const logs = await getDeviceAccessHistory(deviceId, parseInt(limit));
    res.json(logs);
  } catch (error) {
    console.error('Device logs error:', error);
    res.status(500).json({ error: 'Failed to retrieve device logs' });
  }
};

export const getUserLogsController = async (req, res) => {
  const { userId } = req.params;
  const { limit = 100 } = req.query;
  
  try {
    const logs = await getUserActivityHistory(userId, parseInt(limit));
    res.json(logs);
  } catch (error) {
    console.error('User logs error:', error);
    res.status(500).json({ error: 'Failed to retrieve user logs' });
  }
};

export const getHouseLogsController = async (req, res) => {
  const { houseId } = req.params;
  const { limit = 100 } = req.query;
  
  try {
    const logs = await getHouseActivityLogs(houseId, parseInt(limit));
    res.json(logs);
  } catch (error) {
    console.error('House logs error:', error);
    res.status(500).json({ error: 'Failed to retrieve house logs' });
  }
}; 