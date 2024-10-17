// routes/waste.js
const express = require('express');
const { createWasteRecord, getWasteRecordsByDeviceId, addManualWasteRecord,getAllWasteRecords,getAllWasteRecordsAdmin } = require('../controllers/wasteRecordController');
const router = express.Router();

router.post('/update', createWasteRecord);
router.get('/device/:deviceId', getWasteRecordsByDeviceId);
router.post('/add', addManualWasteRecord);
router.get('/:userId', getAllWasteRecords);
router.get('/', getAllWasteRecordsAdmin);



module.exports = router;

