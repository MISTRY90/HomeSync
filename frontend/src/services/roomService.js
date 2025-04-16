import {api} from './api';

export const roomService = {
  createRoom: (houseId, roomData) => 
    api.post(`/${houseId}/rooms`, roomData),
  deleteRoom: (houseId, roomId) => 
    api.delete(`/${houseId}/rooms/${roomId}`),
  getRoomEnergy: (houseId, roomId, period = 'day') => 
    api.get(`/houses/${houseId}/rooms/${roomId}/energy?period=${period}`),
};