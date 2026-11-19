const express = require('express');
const router = express.Router();
const User = require('../models/User');
const FoodDonation = require('../models/FoodDonation');
const DonationRequest = require('../models/DonationRequest');
const NGOProfile = require('../models/NGOProfile');
const ContactMessage = require('../models/ContactMessage');
const { protect, authorize } = require('../middleware/auth');

// All admin routes protected and role guarded
router.use(protect);
router.use(authorize('admin'));

// @route   GET /api/admin/stats
// @desc    Get overall platform KPI statistics
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDonors = await User.countDocuments({ role: 'donor' });
    const totalNgos = await User.countDocuments({ role: 'ngo' });
    const totalDonations = await FoodDonation.countDocuments();
    const pendingRequests = await DonationRequest.countDocuments({ status: 'pending' });
    const completedDonations = await FoodDonation.countDocuments({ status: 'delivered' });

    // Calculate food wastage prevented & meals served
    const allDonations = await FoodDonation.find();
    let totalKgSaved = 0;
    let totalServings = 0;

    allDonations.forEach(d => {
      const kg = d.unit === 'kg' ? d.quantity : Math.round(d.quantity * 0.4);
      totalKgSaved += (kg || 0);
      totalServings += (d.servingsEstimate || (kg * 2.5) || 0);
    });

    const co2AvoidedKg = Math.round(totalKgSaved * 2.5);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalDonors,
        totalNgos,
        totalDonations,
        pendingRequests,
        completedDonations,
        totalKgSaved: Math.round(totalKgSaved),
        totalServings: Math.round(totalServings),
        co2AvoidedKg
      }
    });
  } catch (err) {
    console.error('Error fetching admin stats:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving statistics' });
  }
});

// @route   GET /api/admin/analytics
// @desc    Chart data for Recharts (monthly donations, category distribution, status breakdown)
router.get('/analytics', async (req, res) => {
  try {
    const allDonations = await FoodDonation.find();

    // Category distribution
    const categoryCounts = {};
    allDonations.forEach(d => {
      categoryCounts[d.category] = (categoryCounts[d.category] || 0) + 1;
    });

    const categoryData = Object.keys(categoryCounts).map(cat => ({
      name: cat,
      value: categoryCounts[cat]
    }));

    // Status breakdown
    const statusCounts = {};
    allDonations.forEach(d => {
      statusCounts[d.status] = (statusCounts[d.status] || 0) + 1;
    });

    // Monthly impact trend (simulated 6 months with real base)
    const monthlyTrend = [
      { month: 'Jun', donations: 14, meals: 350, kgSaved: 140 },
      { month: 'Jul', donations: 22, meals: 550, kgSaved: 220 },
      { month: 'Aug', donations: 31, meals: 775, kgSaved: 310 },
      { month: 'Sep', donations: 45, meals: 1125, kgSaved: 450 },
      { month: 'Oct', donations: 58, meals: 1450, kgSaved: 580 },
      { month: 'Nov', donations: allDonations.length + 12, meals: (allDonations.length + 12) * 25, kgSaved: (allDonations.length + 12) * 10 }
    ];

    res.json({
      success: true,
      categoryData,
      statusCounts,
      monthlyTrend
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving analytics data' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with optional role filter
router.get('/users', async (req, res) => {
  try {
    const { role } = req.query;
    const query = role ? { role } : {};
    const users = await User.find(query);

    const safeUsers = users.map(u => ({
      id: u._id || u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      phone: u.phone,
      address: u.address,
      organizationName: u.organizationName,
      isVerified: u.isVerified,
      status: u.status || 'active',
      createdAt: u.createdAt
    }));

    res.json({ success: true, count: safeUsers.length, users: safeUsers });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving users' });
  }
});

// @route   PUT /api/admin/users/:id/verify
// @desc    Verify or unverify NGO
router.put('/users/:id/verify', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const newStatus = !user.isVerified;
    await User.findByIdAndUpdate(req.params.id, { isVerified: newStatus });

    res.json({
      success: true,
      message: `NGO account verification status updated to: ${newStatus ? 'Verified' : 'Unverified'}`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error verifying user' });
  }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Toggle user status (active / suspended)
router.put('/users/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ success: true, message: `User status changed to ${status}`, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating user status' });
  }
});

// @route   GET /api/admin/donations
// @desc    Get all food donations across platform
router.get('/donations', async (req, res) => {
  try {
    const donations = await FoodDonation.find();
    donations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, count: donations.length, donations });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving all donations' });
  }
});

// @route   DELETE /api/admin/donations/:id
// @desc    Admin deletes or moderates a donation
router.delete('/donations/:id', async (req, res) => {
  try {
    await FoodDonation.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Donation post removed by moderator.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error removing donation' });
  }
});

// @route   GET /api/admin/requests
// @desc    Get all donation requests across platform
router.get('/requests', async (req, res) => {
  try {
    const requests = await DonationRequest.find();
    requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, count: requests.length, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving requests' });
  }
});

module.exports = router;
