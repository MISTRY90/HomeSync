import {api} from './api';

export const energyService = {
  logEnergy: (houseId, deviceId, consumption) => 
    api.post(`/houses/${houseId}/energy/log`, { deviceId, consumption }),
  getDeviceEnergy: (houseId, deviceId, period = 'day') => 
    api.get(`/houses/${houseId}/devices/${deviceId}/energy?period=${period}`),
  getHouseEnergy: (houseId, period = 'day') => 
    api.get(`/houses/${houseId}/energy?period=${period}`),
  getEnergyAnalytics: (houseId) => 
    api.get(`/houses/${houseId}/analytics/energy`),
};