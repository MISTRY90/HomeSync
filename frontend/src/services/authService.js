import { api } from './api';

export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  setupMFA: () => api.post('/mfa/setup'),
  verifyMFA: (data) => api.post('/mfa/verify', data),
};