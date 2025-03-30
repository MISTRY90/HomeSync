import { 
    recordEnergyUsage,
    getDeviceEnergyUsage,
    getRoomEnergyUsage,
    getHouseEnergyUsage,
    getEnergySummary,
    getPeakUsageTimes
  } from '../models/EnergyModel.js';
  import { checkPermission, PermissionTypes } from '../middleware/rbacMiddleware.js';
  
  export const logEnergyUsage = async (req, res) => {
    const { deviceId, consumption } = req.body;
    
    try {
      await recordEnergyUsage(deviceId, consumption);
      res.status(201).json({ message: 'Energy usage recorded' });
    } catch (error) {
      console.error('Energy logging error:', error);
      res.status(500).json({ error: 'Failed to record energy usage' });
    }
  };
  
  export const getEnergyAnalytics = async (req, res) => {
    const { houseId } = req.params;
    const { period = 'month' } = req.query;
  
    try {
      const [usage, summary, peakTimes] = await Promise.all([
        getHouseEnergyUsage(houseId, period),
        getEnergySummary(houseId),
        getPeakUsageTimes(houseId)
      ]);
  
      const electricityRate = req.house?.electricity_rate || 0.15;
  
      res.json({
        usage: usage.map(item => ({
          date: item.date,
          consumption: item.total_consumption,
          cost: item.total_consumption * electricityRate
        })),
        summary: summary.map(item => ({
          deviceType: item.device_type,
          consumption: item.total_consumption,
          cost: item.total_consumption * electricityRate,
          deviceCount: item.device_count
        })),
        peakUsageTimes: peakTimes,
        averageDailyUsage: usage.reduce((sum, day) => sum + day.total_consumption, 0) / usage.length
      });
    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).json({ error: 'Failed to get analytics' });
    }
  };
  
  // Keep existing device/room/house controllers from previous implementation
  export const getDeviceEnergyController = async (req, res) => {
    const { deviceId } = req.params;
    const { period = 'day' } = req.query;
  
    try {
      const usage = await getDeviceEnergyUsage(deviceId, period);
      const formatted = usage.map(item => ({
        date: item.date,
        consumption: item.total_consumption,
        cost: item.total_consumption * req.house.electricity_rate
      }));
      res.json(formatted);
    } catch (error) {
      console.error('Energy data error:', error);
      res.status(500).json({ error: 'Failed to get energy data' });
    }
  };
  
  export const getRoomEnergyController = async (req, res) => {
    const { roomId } = req.params;
    const { period = 'day' } = req.query;
  
    try {
      const usage = await getRoomEnergyUsage(roomId, period);
      const formatted = usage.map(item => ({
        date: item.date,
        consumption: item.total_consumption,
        cost: item.total_consumption * req.house.electricity_rate
      }));
      res.json(formatted);
    } catch (error) {
      console.error('Energy data error:', error);
      res.status(500).json({ error: 'Failed to get energy data' });
    }
  };
  
  export const getHouseEnergyController = async (req, res) => {
    const { houseId } = req.params;
    const { period = 'day' } = req.query;
  
    try {
      const usage = await getHouseEnergyUsage(houseId, period);
      const formatted = usage.map(item => ({
        date: item.date,
        consumption: item.total_consumption,
        cost: item.total_consumption * req.house.electricity_rate
      }));
      res.json(formatted);
    } catch (error) {
      console.error('Energy data error:', error);
      res.status(500).json({ error: 'Failed to get energy data' });
    }
  };