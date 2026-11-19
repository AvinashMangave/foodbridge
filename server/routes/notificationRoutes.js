const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

// @route   GET /api/notifications
// @desc    Get current user's notifications
router.get('/', protect, async (req, res) => {
  try {
    const list = await Notification.find({ recipient: req.user.id });
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const unreadCount = list.filter(n => !n.isRead).length;

    res.json({
      success: true,
      unreadCount,
      notifications: list.slice(0, 30)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving notifications' });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark a notification as read
router.put('/:id/read', protect, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating notification' });
  }
});

// @route   PUT /api/notifications/read-all
// @desc    Mark all user's notifications as read
router.put('/read-all', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id });
    for (const notif of notifications) {
      if (!notif.isRead) {
        await Notification.findByIdAndUpdate(notif._id || notif.id, { isRead: true });
      }
    }
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error marking all notifications as read' });
  }
});

module.exports = router;
