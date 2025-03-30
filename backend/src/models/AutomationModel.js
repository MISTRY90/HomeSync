import pool from '../config/db.js';

export const createAutomationRule = async (houseId, ruleData) => {
  const { trigger_type, trigger_params, action_type, action_params, enabled = true } = ruleData;
  
  // Add validation for required fields
  if (!trigger_type || !action_type) {
    throw new Error('Missing required fields');
  }

  const [result] = await pool.query(
    `INSERT INTO AutomationRule 
    (house_id, trigger_type, trigger_params, action_type, action_params, enabled)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [houseId, 
     trigger_type, 
     trigger_params ? JSON.stringify(trigger_params) : null,
     action_type,
     action_params ? JSON.stringify(action_params) : null,
     enabled]
  );
  return result.insertId;
};

export const getAutomationRulesByHouse = async (houseId) => {
  const [rules] = await pool.query(
    'SELECT * FROM AutomationRule WHERE house_id = ?',
    [houseId]
  );
  return rules;
};

export const updateAutomationRule = async (ruleId, updates) => {
  // Build dynamic SET clauses
  const setClauses = [];
  const values = [];
  
  if (updates.trigger_type !== undefined) {
    setClauses.push('trigger_type = ?');
    values.push(updates.trigger_type);
  }
  
  if (updates.trigger_params !== undefined) {
    setClauses.push('trigger_params = ?');
    values.push(JSON.stringify(updates.trigger_params));
  }
  
  if (updates.action_type !== undefined) {
    setClauses.push('action_type = ?');
    values.push(updates.action_type);
  }
  
  if (updates.action_params !== undefined) {
    setClauses.push('action_params = ?');
    values.push(JSON.stringify(updates.action_params));
  }
  
  if (updates.enabled !== undefined) {
    setClauses.push('enabled = ?');
    values.push(updates.enabled);
  }

  if (setClauses.length === 0) {
    throw new Error('No valid fields provided for update');
  }

  values.push(ruleId);

  const [result] = await pool.query(
    `UPDATE AutomationRule 
    SET ${setClauses.join(', ')}
    WHERE rule_id = ?`,
    values
  );
  
  return result.affectedRows > 0;
};

export const deleteAutomationRule = async (ruleId) => {
  const [result] = await pool.query(
    'DELETE FROM AutomationRule WHERE rule_id = ?',
    [ruleId]
  );
  return result.affectedRows > 0;
};

export const getEnabledAutomationRules = async () => {
  const [rules] = await pool.query(
    'SELECT * FROM AutomationRule WHERE enabled = TRUE'
  );
  return rules;
};

export const executeAction = async (actionType, actionParams) => {
  try {
    switch(actionType) {
      case 'DEVICE':
        await updateDeviceState(
          actionParams.deviceId, 
          actionParams.state
        );
        break;
      case 'SCENE':
        // Implement scene execution logic
        break;
      default:
        console.warn(`Unknown action type: ${actionType}`);
    }
  } catch (error) {
    console.error('Action execution failed:', error);
  }
};