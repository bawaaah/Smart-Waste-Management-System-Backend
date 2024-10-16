const MalfunctionReport = require('../models/MalfunctionReport');
const Device = require('../models/Device');


// Fetch all malfunction reports
exports.getMalfunctionReports = async (req, res) => {
    try {
        const userId = req.params.userId;
        const reports = await MalfunctionReport.find({userId: userId}); // Optionally populate device details
        return res.status(200).json(reports);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching reports' });
    }
};

// Delete a malfunction report
exports.deleteMalfunctionReport = async (req, res) => {
    const { reportId, deviceId } = req.body; // Ensure you get both report ID and device ID from the request

    try {
        // Find and delete the report
        const report = await MalfunctionReport.findByIdAndDelete(reportId);

        if (!report) {
            return res.status(404).json({ message: 'Report not found.' });
        }

        // Update the device status to 'active'
        const device = await Device.findOne({ deviceId: deviceId });

        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }

        // Update the device's status to 'malfunctioned'
        device.status = 'Active';
        await device.save();

        return res.status(200).json({ message: 'Report deleted and device status updated to active.' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting report.' });
    }
};
