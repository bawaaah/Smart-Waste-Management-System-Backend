// routes/paymentRoutes.js
const express = require('express');
const { createPaymentIntent } = require('../../controllers/PaymentManagement/Payment');
const schedulePayment = require('../../controllers/PaymentManagement/schedulePaymentDetails');
const SchedulePayment = require('../../controllers/PaymentManagement/SchedulePayment');
const { getPaymentDetails } = require('../../controllers/PaymentManagement/PaymentDetails');

const router = express.Router();

// Route to create a payment intent
router.post('/create-payment-intent', createPaymentIntent);
router.get('/viewSchedulePayment', schedulePayment.getPaymentDetails);
router.post('/savePayment', SchedulePayment.savePayment);
router.get('/payment-details/:userID', getPaymentDetails);


module.exports = router;
