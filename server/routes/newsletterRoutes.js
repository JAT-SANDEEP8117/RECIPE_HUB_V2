const express = require('express');
const router = express.Router();
const { subscribeNewsletter } = require('../controllers/newsletterController');
const rateLimit = require('express-rate-limit');

// Rate limiting for newsletter subscription to prevent abuse
const subscriptionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // limit each IP to 5 requests per windowMs
  message: { message: 'Too many subscription attempts from this IP, please try again after an hour.' }
});

router.post('/subscribe', subscriptionLimiter, subscribeNewsletter);

module.exports = router;
