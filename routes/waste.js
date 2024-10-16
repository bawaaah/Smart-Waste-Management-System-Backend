// routes/waste.js
const express = require('express');
const { createWasteRecord, getWasteRecordsByDeviceId, addManualWasteRecord,getAllWasteRecords } = require('../controllers/wasteRecordController');
const router = express.Router();

router.post('/update', createWasteRecord);
router.get('/device/:deviceId', getWasteRecordsByDeviceId);
router.post('/add', addManualWasteRecord);
router.get('/:userId', getAllWasteRecords);


module.exports = router;

