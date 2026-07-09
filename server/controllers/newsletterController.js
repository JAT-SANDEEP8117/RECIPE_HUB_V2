const Subscriber = require('../models/Subscriber');
const { sendWelcomeNewsletterEmail } = require('../services/emailService');

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide an email address' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Check if duplicate
    const existing = await Subscriber.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ message: 'This email is already subscribed to our newsletter' });
    }

    // Create subscriber
    const newSubscriber = await Subscriber.create({ email: normalizedEmail });

    // Send welcome email in background
    (async () => {
      try {
        await sendWelcomeNewsletterEmail(normalizedEmail);
      } catch (err) {
        console.error(`Welcome email background send failed: ${err.message}`);
      }
    })();

    res.status(201).json({ 
      message: 'Thank you for subscribing! A welcome email has been sent to your inbox.',
      subscriber: newSubscriber 
    });
  } catch (error) {
    console.error('Newsletter controller error:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  subscribeNewsletter
};
