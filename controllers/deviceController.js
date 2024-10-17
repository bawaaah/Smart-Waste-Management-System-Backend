// controllers/deviceController.js
const Device = require('../models/Device');
const QRCode = require('qrcode'); // Ensure QRCode is imported
const MalfunctionReport = require('../models/MalfunctionReport');



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
        const { status, deviceType, capacity, userId} = req.body;

        // Generate a unique device ID based on the device type
        const deviceId = `${deviceType.substring(0, 3).toUpperCase()}-${Date.now()}`; // Example: "PLA-1685000000000"

        // Check if device already exists
        const existingDevice = await Device.findOne({ deviceId });
        if (existingDevice) {
            return res.status(400).json({ message: 'Device already exists' });
        }

        const newDevice = new Device({
            deviceId,
            status: status || 'Active', // Default to 'Active' if status not provided
            spaceLeft: capacity,
            deviceType,
            capacity,
            userId
        });

        // Generate QR code
        const qrCodeData = await QRCode.toDataURL(deviceId); // Generate QR code using deviceId

        // Save the QR code in the device record
        newDevice.qrCode = qrCodeData;

        await newDevice.save();
        res.status(201).json(newDevice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Function to get all devices by ID
exports.getAllDevices = async (req, res) => {
    try {
        const userId = req.params.userId; // Get user ID from request parameters
        const devices = await Device.find({ userId: userId });
        res.status(200).json(devices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllDevicesAdmin = async (req, res) => {
    try {
        const devices = await Device.find();
        res.status(200).json(devices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Check if device exists
exports.checkDeviceExists = async (req, res) => {
    try {
        const { deviceId } = req.params;
        const device = await Device.findOne({ deviceId: deviceId });

        if (!device) {
            return res.status(404).json({ exists: false });
        }
        
        return res.status(200).json({ exists: true });
    } catch (error) {
        return res.status(500).json({ message: 'Error checking device' });
    }
};

// Report a malfunction
exports.reportMalfunction = async (req, res) => {
    try {
        const { deviceId, message, userId } = req.body;

        const device = await Device.findOne({ deviceId: deviceId });

        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }

        // Update the device's status to 'malfunctioned'
        device.status = 'Malfunction';
        await device.save();

        const malfunctionReport = new MalfunctionReport({
            deviceId,
            message,
            userId
        });

        await malfunctionReport.save();
        return res.status(201).json({ message: 'Malfunction report submitted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error submitting report' });
    }
};

// Update device status after reply
exports.updateDeviceStatusReport = async (req, res) => {
    try {
        const { deviceId, status } = req.body;

        const device = await Device.findOne({ deviceId: deviceId });
        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }

        device.status = status; // Update the status to the new one provided
        await device.save();

        return res.status(200).json({ message: 'Device status updated successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating device status' });
    }
};

exports.deleteDevice = async (req, res) => {
    try {
        const { deviceId } = req.params;
        const deletedDevice = await Device.findOneAndDelete({ deviceId });

        if (!deletedDevice) {
            return res.status(404).json({ message: 'Device not found' });
        }

        return res.status(200).json({ message: 'Device deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting device' });
    }
};
