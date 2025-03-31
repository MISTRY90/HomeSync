import {
    inviteUserToHouse,
    updateUserRole,
    createCustomRole,
    getHouseInsights,
    getHouseActivityLogs,
    getFilteredActivityLogs,
    getActivityLogsSummary
  } from '../models/AdminModel.js';
  import { Parser } from 'json2csv';
  
  export const inviteUserController = async (req, res) => {
    const { houseId } = req;
    const { email, roleId } = req.body;
  
    try {
      await inviteUserToHouse(houseId, email, roleId);
      res.json({ message: 'User invited successfully' });
    } catch (error) {
      console.error('Invite error:', error);
      res.status(400).json({ error: error.message });
    }
  };
  
  export const createRoleController = async (req, res) => {
    const { houseId } = req;
    const { name, permissions } = req.body;
  
    try {
      const roleId = await createCustomRole(houseId, name, permissions);
      res.status(201).json({ roleId, message: 'Role created' });
    } catch (error) {
      console.error('Role creation error:', error);
      res.status(500).json({ error: 'Failed to create role' });
    }
  };
  
  export const getDashboardController = async (req, res) => {
    try {
      // Get all data in parallel for better performance
      const [insights, recentActivity, activitySummary] = await Promise.all([
        getHouseInsights(req.houseId),
        getHouseActivityLogs(req.houseId, 5),
        getActivityLogsSummary(req.houseId)
      ]);
      
      // Return combined data
      res.json({
        ...insights,
        recentActivity,
        activitySummary
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).json({ error: 'Failed to load insights' });
    }
  };

  export const updateUserRoleController = async (req, res) => {
    const { houseId } = req; // From isHouseAdmin middleware
    const { userId } = req.params;
    const { roleId } = req.body;
  
    try {
      await updateUserRole(houseId, userId, roleId);
      res.json({ message: 'User role updated successfully' });
    } catch (error) {
      console.error('Role update error:', error);
      res.status(400).json({ 
        error: error.message || 'Failed to update role' 
      });
    }
  };

  export const getActivityLogsController = async (req, res) => {
    const { houseId } = req;
    const { 
      limit = 100, 
      userId, 
      deviceId, 
      roomId, 
      action, 
      startDate, 
      endDate 
    } = req.query;
    
    try {
      const filters = {
        limit: parseInt(limit),
        userId: userId ? parseInt(userId) : undefined,
        deviceId: deviceId ? parseInt(deviceId) : undefined,
        roomId: roomId ? parseInt(roomId) : undefined,
        action,
        startDate,
        endDate
      };
      
      const logs = await getFilteredActivityLogs(houseId, filters);
      res.json(logs);
    } catch (error) {
      console.error('Activity logs error:', error);
      res.status(500).json({ error: 'Failed to retrieve activity logs' });
    }
  };

  export const exportActivityLogsController = async (req, res) => {
    const { houseId } = req;
    const { format = 'csv' } = req.query;
    
    try {
      // Get all logs without limit
      const logs = await getFilteredActivityLogs(houseId, { limit: 10000, ...req.query });
      
      if (format === 'csv') {
        // Define fields for CSV
        const fields = [
          'log_id', 
          'timestamp', 
          'user_name', 
          'email', 
          'device_name', 
          'device_type', 
          'room_name', 
          'action'
        ];
        
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(logs);
        
        res.header('Content-Type', 'text/csv');
        res.attachment(`house_${houseId}_activity_logs.csv`);
        return res.send(csv);
      }
      
      // Default to JSON
      res.json(logs);
    } catch (error) {
      console.error('Export logs error:', error);
      res.status(500).json({ error: 'Failed to export activity logs' });
    }
  };