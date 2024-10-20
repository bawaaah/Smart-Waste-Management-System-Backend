const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentMethodId: { type: String, required: true },
  billingDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: {
      line1: { type: String, required: true },
    },
  },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
