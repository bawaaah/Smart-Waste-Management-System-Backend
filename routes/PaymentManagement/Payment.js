// routes/paymentRoutes.js
const express = require('express');
const { createPaymentIntent } = require('../../controllers/PaymentManagement/Payment');

const router = express.Router();

// Route to create a payment intent
router.post('/create-payment-intent', createPaymentIntent);

module.exports = router;
