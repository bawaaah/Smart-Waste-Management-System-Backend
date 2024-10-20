const Device = require('../../models/Device');

class schedulePaymentDetails {

    static async getPaymentDetails(req, res) {
        try {
            // Access deviceId from query parameters (req.query)
            const { deviceId } = req.query;

            // Find the device based on deviceId
            const result = await Device.find({ deviceId: deviceId });

            // Check if no devices were found
            if (result.length === 0) {
                return res.status(404).json({ message: 'Device not found' });
            }

            // Return the device data
            res.json(result);
        } catch (error) {
            // Return error message in case of failure
            res.status(500).json({ message: error.message });
        }
    }

}

module.exports = schedulePaymentDetails;
