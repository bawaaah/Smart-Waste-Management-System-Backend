require('dotenv').config();

// controllers/paymentController.js
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Load the Stripe secret key

// Controller for creating a payment intent
const createPaymentIntent = async (req, res) => {
  const { amount } = req.body;

  try {
    // Create a PaymentIntent with the specified amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: 'usd',
    });

    // Send back the client secret
    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPaymentIntent };
