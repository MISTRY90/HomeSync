  import {api} from './api';

  export const houseService = {
    createHouse: (houseData) => api.post('/houses', houseData),
    deleteHouse: (houseId) => api.delete(`/houses/${houseId}`),
    getHouses: (userId) => api.get(`houses/user-houses/${userId}`),
    inviteUser: (houseId, email, roleId) => 
      api.post(`/houses/${houseId}/invite`, { email, roleId }),
    updateUserRole: (houseId, userId, roleId) => 
      api.put(`/houses/${houseId}/users/${userId}/role`, { roleId }),
    exportActivityLogs: (houseId, format = 'json') => 
      api.get(`/houses/${houseId}/activity-logs/export?format=${format}`),
    getHouseLogs: (houseId) => api.get(`/houses/${houseId}/logs`),
  };