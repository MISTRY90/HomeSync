// // src/utils/mqtt.js
// import mqtt from 'mqtt';
// import { updateDeviceState } from '../models/DeviceModel.js';
// import winston from 'winston';

// // Configure Winston logger
// const logger = winston.createLogger({
//     level: 'info',
//     format: winston.format.combine(
//         winston.format.timestamp(),
//         winston.format.json()
//     ),
//     transports: [
//         new winston.transports.File({ filename: 'error.log', level: 'error' }),
//         new winston.transports.File({ filename: 'combined.log' })
//     ]
// });

// class MqttManager {
//     constructor() {
//         this.client = null;
//         this.isConnected = false;
//         this.reconnectAttempts = 0;
//         this.MAX_RECONNECT_ATTEMPTS = 5;
//     }

//     connect() {
//         const brokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
        
//         // Reset reconnect attempts
//         this.reconnectAttempts = 0;

//         // Connection options with improved error handling
//         const options = {
//             clientId: `smart-home-backend-${Math.random().toString(16).substr(2, 8)}`,
//             clean: true,
//             reconnectPeriod: 5000, // 5 seconds between reconnect attempts
//             connectTimeout: 10000, // 10 seconds
//             rejectUnauthorized: false, // Only for development, use proper SSL in production
//             protocol: 'mqtt'  // Explicitly specify the protocol
//         };

//         this.client = mqtt.connect(brokerUrl, options);

//         // Connection event handlers
//         this.client.on('connect', this.onConnect.bind(this));
//         this.client.on('error', this.onError.bind(this));
//         this.client.on('close', this.onClose.bind(this));
//         this.client.on('offline', this.onOffline.bind(this));
//         this.client.on('message', this.onMessage.bind(this));

//         return this.client;
//     }

//     onConnect() {
//         this.isConnected = true;
//         this.reconnectAttempts = 0;
//         logger.info('Connected to MQTT Broker');
        
//         // Subscribe to device state update topics
//         this.client.subscribe('devices/+/state/update', (err) => {
//             if (err) {
//                 logger.error('MQTT Subscription Error', { error: err });
//             }
//         });

//         // Subscribe to state changes
//         this.client.subscribe(`devices/${deviceId}/state`);
//     }

//     onError(error) {
//         this.isConnected = false;
//         logger.error('MQTT Connection Error', { 
//             error: error.message,
//             reconnectAttempts: this.reconnectAttempts 
//         });

//         // Implement exponential backoff
//         if (this.reconnectAttempts < this.MAX_RECONNECT_ATTEMPTS) {
//             const delay = Math.pow(2, this.reconnectAttempts) * 1000;
//             setTimeout(() => this.connect(), delay);
//             this.reconnectAttempts++;
//         } else {
//             logger.error('Max reconnection attempts reached. Manual intervention required.');
//         }
//     }

//     onClose() {
//         this.isConnected = false;
//         logger.warn('MQTT Connection Closed');
//     }

//     onOffline() {
//         this.isConnected = false;
//         logger.warn('MQTT Client Offline');
//     }

//     async onMessage(topic, message) {
//         try {
//             // Parse topic and message
//             const match = topic.match(/devices\/(\d+)\/state\/update/);
//             if (match) {
//                 const deviceId = match[1];
//                 const newState = JSON.parse(message.toString());
                
//                 // Validate state before update
//                 if (this.validateDeviceState(newState)) {
//                     await updateDeviceState(deviceId, newState);
//                     this.publishMessage(`devices/${deviceId}/state`, JSON.stringify(newState));
//                 } else {
//                     logger.warn('Invalid device state received', { 
//                         deviceId, 
//                         state: newState 
//                     });
//                 }
//             }

//             // Handle incoming messages
//             console.log(`Received update on ${topic}:`, message.toString());
//         } catch (error) {
//             logger.error('MQTT Message Processing Error', { 
//                 error: error.message,
//                 topic,
//                 message: message.toString() 
//             });
//         }
//     }

//     validateDeviceState(state) {
//         // Basic state validation
//         if (typeof state !== 'object' || state === null) {
//             return false;
//         }

//         // Add more specific validation based on device types
//         const requiredFields = ['on_off']; // Minimum required field
//         return requiredFields.every(field => field in state);
//     }

//     publishMessage(topic, message) {
//         if (!this.isConnected) {
//             logger.warn('Cannot publish message. MQTT not connected', { topic, message });
//             return false;
//         }

//         try {
//             this.client.publish(topic, message, { 
//                 qos: 1, // At least once delivery
//                 retain: true // Retain last known state
//             });
//             return true;
//         } catch (error) {
//             logger.error('Message publish failed', { 
//                 topic, 
//                 error: error.message 
//             });
//             return false;
//         }
//     }

//     // Graceful shutdown method
//     disconnect() {
//         if (this.client) {
//             this.client.end(true, () => {
//                 logger.info('MQTT Client Disconnected');
//             });
//         }
//     }
// }

// // Singleton export
// const mqttManager = new MqttManager();

// export default mqttManager;