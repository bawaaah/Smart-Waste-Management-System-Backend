// controllers/deviceController.js
const Device = require('../models/Device');

exports.updateDeviceStatus = async (req, res) => {
    try {
        const { deviceId, status } = req.body;
        const updatedDevice = await Device.findOneAndUpdate(
            { deviceId },
            { status, lastUpdated: Date.now() },
            { new: true }
        );
        res.status(200).json(updatedDevice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getDeviceStatus = async (req, res) => {
    try {
        const { deviceId } = req.params;
        const device = await Device.findOne({ deviceId });
        res.status(200).json(device);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addDevice = async (req, res) => {
    try {
        const { deviceId, status,spaceLeft,deviceType,capacity } = req.body;
        
        // Check if device already exists
        const existingDevice = await Device.findOne({ deviceId });
        if (existingDevice) {
            return res.status(400).json({ message: 'Device already exists' });
        }

        const newDevice = new Device({
            deviceId,
            status: status || 'Active', // Default to 'Active' if status not provided
            spaceLeft:100,
            deviceType,
            capacity
        });

        await newDevice.save();
        res.status(201).json(newDevice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Function to get all devices
exports.getAllDevices = async (req, res) => {
    try {
        const devices = await Device.find();
        res.status(200).json(devices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};