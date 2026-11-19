const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const NGOProfile = require('../models/NGOProfile');
const { protect } = require('../middleware/auth');

const signToken = (user) => {
  const secret = process.env.JWT_SECRET || 'foodbridge_super_secret_jwt_key_2026';
  return jwt.sign(
    {
      id: user._id || user.id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    secret,
    { expiresIn: '7d' }
  );
};

// @route   POST /api/auth/register
// @desc    Register a new user (Donor or NGO)
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = 'donor',
      phone = '',
      address = '',
      organizationName = '',
      focusArea = ''
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    // Check if user already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      phone,
      address,
      organizationName: organizationName || (role === 'ngo' ? name + ' Foundation' : name),
      isVerified: role === 'ngo' ? false : true, // NGOs start unverified until admin verifies
      avatar: `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(name)}`
    });

    // If NGO, create NGO profile record
    if (role === 'ngo') {
      await NGOProfile.create({
        user: newUser._id || newUser.id,
        organizationName: organizationName || name,
        registrationNumber: 'REG-' + Math.floor(100000 + Math.random() * 900000),
        focusArea: focusArea || 'Hunger Relief & Vulnerable Community Aid',
        dailyCapacityServings: 150,
        address: address || 'Community Center, City',
        verified: false
      });
    }

    const token = signToken(newUser);

    const safeUser = {
      id: newUser._id || newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      address: newUser.address,
      organizationName: newUser.organizationName,
      isVerified: newUser.isVerified,
      avatar: newUser.avatar
    };

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to FoodBridge.',
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = signToken(user);

    const safeUser = {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      organizationName: user.organizationName,
      isVerified: user.isVerified,
      avatar: user.avatar
    };

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// @route   POST /api/auth/demo-login
// @desc    Fast 1-click Demo Login for presentations
router.post('/demo-login', async (req, res) => {
  try {
    const { role = 'donor' } = req.body;
    let targetEmail = 'donor@restaurant.com';

    if (role === 'ngo') {
      targetEmail = 'ngo@robinhood.org';
    } else if (role === 'admin') {
      targetEmail = 'admin@foodbridge.org';
    }

    const user = await User.findOne({ email: targetEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `Demo user for role '${role}' not found. Please run seed script or register.`
      });
    }

    const token = signToken(user);

    const safeUser = {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      organizationName: user.organizationName,
      isVerified: user.isVerified,
      avatar: user.avatar
    };

    res.json({
      success: true,
      message: `Demo mode: Logged in as ${user.name} (${user.role.toUpperCase()})`,
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('Demo login error:', err);
    res.status(500).json({ success: false, message: 'Server error during demo login.' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged in user
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const safeUser = {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      organizationName: user.organizationName,
      isVerified: user.isVerified,
      avatar: user.avatar
    };

    res.json({ success: true, user: safeUser });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching profile' });
  }
});

module.exports = router;
