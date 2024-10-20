// routes/paymentRoutes.js
const express = require('express');
const { createPaymentIntent } = require('../../controllers/PaymentManagement/Payment');
const schedulePayment = require('../../controllers/PaymentManagement/schedulePaymentDetails');
const SchedulePayment = require('../../controllers/PaymentManagement/SchedulePayment');

const router = express.Router();

// Route to create a payment intent
router.post('/create-payment-intent', createPaymentIntent);
router.get('/viewSchedulePayment', schedulePayment.getPaymentDetails);
router.post('/savePayment', SchedulePayment.savePayment);


module.exports = router;
