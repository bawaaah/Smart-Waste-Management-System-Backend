// routes/device.js
const express = require('express');
const { updateDeviceStatus, getDeviceStatus, addDevice,getAllDevices,checkDeviceExists,reportMalfunction } = require('../controllers/deviceController');
const router = express.Router();

router.post('/status', updateDeviceStatus);
router.get('/deviceID/:deviceId', getDeviceStatus);

// New route: Add new device manually
router.post('/add', addDevice);
// Fetch all devices
router.get('/:userId', getAllDevices);
// Check if the device exists
router.get('/device/:deviceId', checkDeviceExists);

// Report a malfunction
router.post('/report-malfunction', reportMalfunction);
// Get all malfunction reports


module.exports = router;