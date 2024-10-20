const Payment = require('../../models/Payment');

// Function to calculate cash rewards based on payment amount
const calculateCashRewards = (payments) => {
  return payments.map(payment => {
    // Example logic: 10% of the payment amount as cash reward
    return payment.amount * 0.1; // Adjust this calculation as necessary
  });
};

const getPaymentDetails = async (req, res) => {
  const { userID } = req.params; // Extract userID from the request parameters
 console.log(userID);
 
  try {
    // Fetch payment details based on userId
    const payments = await Payment.find({ userId: userID }); // Use .lean() for better performance
    console.log(payments);
    
    // Check if payments were found
    if (!payments.length) {
      return res.status(404).json({ message: 'No payments found for this user.' });
    }

    // Prepare response data
    const cashRewards = calculateCashRewards(payments); // Calculate cash rewards
    const previousPayments = payments.map(payment => ({
      _id: payment._id,
      amount: payment.amount,
    }));

    // Calculate total amount to pay
    const totalAmount = payments.reduce((total, payment) => total + payment.amount, 0);

    // Prepare service payment
    const servicePayment = payments[payments.length - 1]; // Last payment or null if needed

    // Send response
    res.json({
      cashRewards,
      previousPayments,
      servicePayment,
      amount: totalAmount,
    });
  } catch (error) {
    console.error('Error fetching payment details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getPaymentDetails,
};
