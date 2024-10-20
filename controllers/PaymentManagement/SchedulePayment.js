const Payment = require('../../models/Payment');

class SchedulePayment {
  static async savePayment(req, res) {
    const { userId, amount, paymentMethodId, billingDetails } = req.body;

    try {
      // Create a new payment document
      const payment = new Payment({
        userId,
        amount,
        paymentMethodId,
        billingDetails,
        status: 'succeeded', // Assuming the payment succeeded
      });

      // Save to the database
      await payment.save();

      res.status(201).json({ message: 'Payment saved successfully', payment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error saving payment', error });
    }
  }
}

module.exports = SchedulePayment;
