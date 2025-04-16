import {api} from './api';

export const userService = {
  getUserLogs: (userId) => api.get(`/users/${userId}/logs`),
  getDeviceLogs: (deviceId) => api.get(`/devices/${deviceId}/logs`),
};