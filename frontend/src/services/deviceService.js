import {api} from './api';

export const deviceService = {
  registerDevice: (houseId, deviceData) =>
    api.post(`/houses/${houseId}/register`, deviceData),
  updateState: (houseId, deviceId, newState) =>
    api.put(`/houses/${houseId}/state`, { deviceId, newState }),
  getDevices: (houseId) => api.get(`/houses/${houseId}`),
  deleteDevice: (houseId, deviceId) =>
    api.delete(`/houses/${houseId}/dev/celd`), // Verify endpoint spelling
};