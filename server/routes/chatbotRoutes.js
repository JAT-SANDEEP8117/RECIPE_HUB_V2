const express = require('express');
const router = express.Router();
const { chatWithAssistant } = require('../controllers/chatbotController');
const rateLimit = require('express-rate-limit');

// Chatbot specific rate limiting to prevent abuse
const chatbotLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: { message: 'Too many requests to the chatbot, please try again after 15 minutes' }
});

router.post('/', chatbotLimiter, chatWithAssistant);

module.exports = router;
