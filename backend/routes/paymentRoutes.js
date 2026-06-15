const express = require('express');
const { createPaymentIntent, completeDemoPayment, handleWebhook } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/demo-complete', protect, completeDemoPayment);
// Webhook handler (raw body already parsed in server.js)
router.post('/webhook', handleWebhook);

module.exports = router;
