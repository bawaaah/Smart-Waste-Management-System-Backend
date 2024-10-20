const MalfunctionReport = require('../models/MalfunctionReport');
const Device = require('../models/Device');


// Fetch all malfunction reports by user
exports.getMalfunctionReports = async (req, res) => {
    try {
        const userId = req.params.userId;
        const reports = await MalfunctionReport.find({userId: userId}).sort({ dateReported: -1 }); // Optionally populate device details
        return res.status(200).json(reports);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching reports' });
    }
}

// Fetch all malfunction reports
exports.getMalfunctionReportsAdmin = async (req, res) => {
    try {
        const reports = await MalfunctionReport.find().sort({ dateReported: -1 }); // Optionally populate device details
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

// Reply to a malfunction report
exports.replyToMalfunctionReport = async (req, res) => {
    try {
        const { reportId, reply, deviceId } = req.body;

        // Update the malfunction report with the admin's reply
        const report = await MalfunctionReport.findById(reportId);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        report.reply = reply; // Assuming you have a reply field in your MalfunctionReport schema
        await report.save();

        return res.status(200).json({ message: 'Reply submitted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error replying to report' });
    }
};

// Edit a malfunction report
exports.updateMalfunctionReport = async (req, res) => {
    try {
        const { id } = req.params; // Extract the report ID from the request parameters
        const { message } = req.body; // Get the updated message from the request body

        // Find the malfunction report by ID
        const report = await MalfunctionReport.findById(id);

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        // Update the message of the report
        report.message = message;
        await report.save();

        return res.status(200).json({ message: 'Malfunction report updated successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating report' });
    }
};