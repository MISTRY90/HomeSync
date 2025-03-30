// controllers/securityController.js
import { 
    logSecurityEvent, 
    getSecurityLogsByHouse, 
    validateDeviceInHouse 
  } from '../models/SecurityModel.js';
  
  export const logSecurityEventController = async (req, res) => {
    const { houseId } = req.params;
    const { deviceId, eventType } = req.body;
  
    try {
      // Validate device belongs to the house
      const isValidDevice = await validateDeviceInHouse(deviceId, houseId);
      if (!isValidDevice) {
        return res.status(403).json({ error: 'Device not part of this house' });
      }
  
      // Log event (database logic moved to model)
      const eventId = await logSecurityEvent(deviceId, eventType);
      
      res.status(201).json({ 
        message: 'Security event logged', 
        eventId 
      });
    } catch (error) {
      console.error('Security logging error:', error);
      res.status(500).json({ error: 'Failed to log event' });
    }
  };
  
  export const getSecurityLogsController = async (req, res) => {
    const { houseId } = req.params;
    try {
      const logs = await getSecurityLogsByHouse(houseId);
      res.json(logs);
    } catch (error) {
      console.error('Fetch logs error:', error);
      res.status(500).json({ error: 'Failed to fetch logs' });
    }
  };