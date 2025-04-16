import {api} from './api';

export const automationService = {
  createAutomation: (houseId, automationData) => 
    api.post(`/houses/${houseId}/automations`, automationData),
  getAutomations: (houseId) => 
    api.get(`/houses/${houseId}/automations`),
  updateAutomation: (houseId, ruleId, automationData) => 
    api.put(`/houses/${houseId}/automations/${ruleId}`, automationData),
  deleteAutomation: (houseId, ruleId) => 
    api.delete(`/houses/${houseId}/automations/${ruleId}`),
};