import cron from 'node-cron';
// import mqttManager from './mqtt.js';
import { getEnabledAutomationRules } from '../models/AutomationModel.js';
import { updateDeviceState } from '../models/DeviceModel.js';

class Scheduler {
  constructor() {
    this.jobs = new Map();
  }

  async initialize() {
    const rules = await getEnabledAutomationRules();
    rules.forEach(rule => this.addJob(rule.rule_id, rule));
  }

  addJob(ruleId, rule) {
    if (rule.trigger_type === 'TIME' && rule.enabled) {
      const cronExpression = rule.trigger_params?.cron;
      if (!cron.validate(cronExpression)) {
        throw new Error('Invalid cron expression');
      }
      
      const job = cron.schedule(cronExpression, () => 
        this.executeAction(rule.action_type, rule.action_params)
      );
      this.jobs.set(ruleId, job);
    }
  }

  updateJob(ruleId, updatedRule) {
    this.removeJob(ruleId);
    if (updatedRule.enabled) {
      this.addJob(ruleId, updatedRule);
    }
  }

  removeJob(ruleId) {
    const job = this.jobs.get(ruleId);
    if (job) {
      job.stop();
      this.jobs.delete(ruleId);
    }
  }

  async executeAction(actionType, actionParams) {
    try {
      switch(actionType) {
        case 'DEVICE':
          if (!actionParams?.deviceId || !actionParams?.state) {
            console.error('Missing device action parameters');
            return;
          }
          await updateDeviceState(
            actionParams.deviceId, 
            actionParams.state
          );
          break;
        case 'SCENE':
          console.log('Scene execution not implemented');
          break;
        default:
          console.warn(`Unknown action type: ${actionType}`);
      }
    } catch (error) {
      console.error('Action execution failed:', error);
    }
  }
}

const scheduler = new Scheduler();
export default scheduler;