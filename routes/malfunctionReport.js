const express = require('express');
const { getMalfunctionReports,deleteMalfunctionReport } = require('../controllers/MalfunctionReportController');
const router = express.Router();

router.get('/:userId', getMalfunctionReports); 
router.delete('/delete', deleteMalfunctionReport);


module.exports = router;