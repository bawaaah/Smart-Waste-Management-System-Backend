// controllers/wasteRecordController.js
const WasteRecord = require('../models/WasteRecord');
const Device = require('../models/Device');

exports.createWasteRecord = async (req, res) => {
    try {
        const { weight, spaceLeft, deviceId } = req.body;

        const newWasteRecord = new WasteRecord({
            weight,
            spaceLeft,
            deviceId,
        });

        await newWasteRecord.save();
        res.status(201).json(newWasteRecord);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getWasteRecordsByDeviceId = async (req, res) => {
    try {
        const { deviceId } = req.params;
        const records = await WasteRecord.find({ deviceId }).sort({ date: -1 });
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// New function: Add manual waste record
exports.addManualWasteRecord = async (req, res) => {
    try {
        const { weight, spaceLeft, deviceId } = req.body;
        
        // Check if the device exists
        const device = await Device.findOne({ deviceId });
        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }

        const newWasteRecord = new WasteRecord({
            weight,
            deviceId,
        });

        await newWasteRecord.save();
        res.status(201).json(newWasteRecord);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};