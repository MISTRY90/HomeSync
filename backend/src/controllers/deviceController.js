// src/controllers/deviceController.js
import { 
    createDevice, 
    updateDeviceState, 
    getDevicesByHouse, 
    getDeviceTypes,
    deleteDevice
} from '../models/DeviceModel.js';
import mqttManager from '../utils/mqtt.js';

export const registerDeviceController = async (req, res) => {
    const { 
        houseId, 
        roomId, 
        typeId, 
        uniqueIdentifier, 
        name, 
        initialState 
    } = req.body;
    const userId = req.user.userId;

    try {
        // Verify user has permission to add device to this house/room
        const deviceId = await createDevice(
            houseId, 
            roomId, 
            typeId, 
            uniqueIdentifier, 
            name, 
            initialState
        );

        res.status(201).json({
            message: 'Device registered successfully',
            deviceId
        });
    } catch (error) {
        console.error('Device registration error:', error);
        res.status(500).json({ error: 'Failed to register device' });
    }
};

export const updateDeviceStateController = async (req, res) => {
    const { deviceId, newState } = req.body;
    const userId = req.user.userId;

    try {
        // Verify user has permission to update device
        const updated = await updateDeviceState(deviceId, newState);
        
        if (updated) {
            // Use mqttManager.publishMessage instead of publishMqttMessage
            mqttManager.publishMessage(`devices/${deviceId}/state`, JSON.stringify(newState));
            
            res.json({ 
                message: 'Device state updated successfully',
                deviceId,
                newState 
            });
        } else {
            res.status(404).json({ error: 'Device not found' });
        }
    } catch (error) {
        console.error('Device state update error:', error);
        res.status(500).json({ error: 'Failed to update device state' });
    }
};

export const listDevicesController = async (req, res) => {
    const { houseId } = req.params;
    const userId = req.user.userId;

    try {
        // Verify user has access to this house
        const devices = await getDevicesByHouse(houseId);
        res.json(devices);
    } catch (error) {
        console.error('List devices error:', error);
        res.status(500).json({ error: 'Failed to retrieve devices' });
    }
};

export const listDeviceTypesController = async (req, res) => {
    try {
        const deviceTypes = await getDeviceTypes();
        res.json(deviceTypes);
    } catch (error) {
        console.error('List device types error:', error);
        res.status(500).json({ error: 'Failed to retrieve device types' });
    }
};

export const deleteDeviceController = async (req, res) => {
    const { deviceId } = req.params;
    const { houseId } = req.params;
    const userId = req.user.userId;

    try {
        const deleted = await deleteDevice(deviceId, houseId);
        if (deleted) {
            res.json({ 
                message: 'Device deleted successfully',
                deviceId
            });
        } else {
            res.status(404).json({ error: 'Device not found' });
        }
    } catch (error) {
        console.error('Device deletion error:', error);
        res.status(500).json({ error: 'Failed to delete device' });
    }
};