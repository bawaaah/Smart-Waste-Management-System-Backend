// routes/device.js
const express = require('express');
const { updateDeviceStatus, getDeviceStatus, addDevice,getAllDevices,checkDeviceExists,reportMalfunction,getAllDevicesAdmin ,updateDeviceStatusReport, deleteDevice} = require('../controllers/deviceController');
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
router.get('/', getAllDevicesAdmin);

router.put('/updateDeviceStatusReport', updateDeviceStatusReport);

router.delete('/delete/:deviceId', deleteDevice);


module.exports = router;