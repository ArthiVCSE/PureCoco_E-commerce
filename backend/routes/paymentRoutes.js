const express = require('express');
const { createPaymentIntent, handleWebhook } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/create-payment-intent', protect, createPaymentIntent);
// Webhook handler (raw body already parsed in server.js)
router.post('/webhook', handleWebhook);

module.exports = router;
