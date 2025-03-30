import { 
    createAutomationRule, 
    getAutomationRulesByHouse,
    updateAutomationRule,
    deleteAutomationRule
  } from '../models/AutomationModel.js';
  import { checkPermission, PermissionTypes } from '../middleware/rbacMiddleware.js';
  import scheduler from '../utils/scheduler.js';
  
  export const createAutomationController = async (req, res) => {
    const { houseId } = req.params;
    const { trigger_type, action_type } = req.body;
    
    // Basic validation
    if (!trigger_type || !action_type) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const ruleId = await createAutomationRule(houseId, req.body);
        if (req.body.enabled) {
            await scheduler.addJob(ruleId, req.body);
        }
        res.status(201).json({ message: 'Automation rule created', ruleId });
    } catch (error) {
        console.error('Automation creation error:', error);
        res.status(500).json({ error: error.message || 'Failed to create automation rule' });
    }
  };
  
  export const getAutomationsController = async (req, res) => {
    const { houseId } = req.params;
    try {
      const rules = await getAutomationRulesByHouse(houseId);
      res.json(rules);
    } catch (error) {
      console.error('Get automations error:', error);
      res.status(500).json({ error: 'Failed to retrieve rules' });
    }
  };
  
  export const updateAutomationController = async (req, res) => {
    const { ruleId } = req.params;
    try {
      const updated = await updateAutomationRule(ruleId, req.body);
      if (updated) {
        await scheduler.updateJob(ruleId, req.body);
        res.json({ message: 'Rule updated successfully' });
      } else {
        res.status(404).json({ error: 'Rule not found' });
      }
    } catch (error) {
      console.error('Update automation error:', error);
      res.status(500).json({ error: 'Failed to update rule' });
    }
  };
  
  export const deleteAutomationController = async (req, res) => {
    const { ruleId } = req.params;
    try {
      await scheduler.removeJob(ruleId);
      const deleted = await deleteAutomationRule(ruleId);
      if (deleted) {
        res.json({ message: 'Rule deleted successfully' });
      } else {
        res.status(404).json({ error: 'Rule not found' });
      }
    } catch (error) {
      console.error('Delete automation error:', error);
      res.status(500).json({ error: 'Failed to delete rule' });
    }
  };