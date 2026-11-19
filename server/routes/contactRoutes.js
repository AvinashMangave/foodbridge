const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/contact
// @desc    Submit a contact / inquiry message
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Please fill in all contact form fields.' });
    }

    const newMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message,
      status: 'new'
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out to FoodBridge! Our support team will get back to you shortly.',
      data: newMessage
    });
  } catch (err) {
    console.error('Contact error:', err);
    res.status(500).json({ success: false, message: 'Server error saving message.' });
  }
});

// @route   GET /api/contact
// @desc    Get all contact messages (Admin)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const messages = await ContactMessage.find();
    messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, count: messages.length, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving messages.' });
  }
});

module.exports = router;
