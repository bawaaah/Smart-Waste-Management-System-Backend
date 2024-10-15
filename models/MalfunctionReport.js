const mongoose = require('mongoose');

const MalfunctionReportSchema = new mongoose.Schema({
    deviceId: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    dateReported: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('MalfunctionReport', MalfunctionReportSchema);
