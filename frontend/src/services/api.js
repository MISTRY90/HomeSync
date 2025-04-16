// src/services/api.js
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Export a function to inject store after initialization
export const injectStore = (store) => {
  // Request Interceptor
  api.interceptors.request.use((config) => {
    const { accessToken } = store.getState().auth;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`; // Fixed template string
    }
    return config;
  });

  // Response Interceptor (fixed)
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const { data } = await api.post('/auth/refresh');
          store.dispatch(tokenRefresh(data.accessToken)); // Fixed action
          return api(originalRequest);
        } catch (refreshError) {
          store.dispatch(logoutUser()); // Fixed action name
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
};