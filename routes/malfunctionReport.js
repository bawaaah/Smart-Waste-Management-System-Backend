const express = require('express');
const { getMalfunctionReports,deleteMalfunctionReport,getMalfunctionReportsAdmin,replyToMalfunctionReport,updateMalfunctionReport } = require('../controllers/MalfunctionReportController');
const router = express.Router();

router.get('/:userId', getMalfunctionReports); 
router.delete('/delete', deleteMalfunctionReport);
router.get('/', getMalfunctionReportsAdmin); 
router.put('/replyToMalfunctionReport', replyToMalfunctionReport); 
router.put('/update/:id', updateMalfunctionReport); 





module.exports = router;