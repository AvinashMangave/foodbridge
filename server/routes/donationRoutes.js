const express = require('express');
const router = express.Router();
const FoodDonation = require('../models/FoodDonation');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/donations
// @desc    Get all available donations with search and filters
router.get('/', async (req, res) => {
  try {
    const { search, category, status, urgency, city } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    } else {
      // By default show available donations
      query.status = 'available';
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }

    let donations = await FoodDonation.find(query);

    // Search filter across title, donorName, pickupAddress, description
    if (search) {
      const s = search.toLowerCase();
      donations = donations.filter(d =>
        (d.title && d.title.toLowerCase().includes(s)) ||
        (d.donorName && d.donorName.toLowerCase().includes(s)) ||
        (d.pickupAddress && d.pickupAddress.toLowerCase().includes(s)) ||
        (d.description && d.description.toLowerCase().includes(s)) ||
        (d.category && d.category.toLowerCase().includes(s))
      );
    }

    // Urgency filter: expiring within 4 hours
    if (urgency === 'soon') {
      const now = new Date();
      const in4Hours = new Date(now.getTime() + 4 * 60 * 60 * 1000);
      donations = donations.filter(d => {
        const exp = new Date(d.expiryTime);
        return exp > now && exp <= in4Hours;
      });
    }

    // Sort by createdAt descending
    donations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      count: donations.length,
      donations
    });
  } catch (err) {
    console.error('Error fetching donations:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving food donations.' });
  }
});

// @route   GET /api/donations/featured
// @desc    Get top featured food donations for landing page
router.get('/featured', async (req, res) => {
  try {
    const donations = await FoodDonation.find({ status: 'available' });
    donations.sort((a, b) => new Date(a.expiryTime) - new Date(b.expiryTime));
    const featured = donations.slice(0, 4);

    res.json({
      success: true,
      donations: featured
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching featured donations.' });
  }
});

// @route   GET /api/donations/matching
// @desc    Smart matching: Recommend donations to NGO based on capacity & category
router.get('/matching', protect, authorize('ngo', 'admin'), async (req, res) => {
  try {
    const available = await FoodDonation.find({ status: 'available' });

    // Calculate score for each donation based on urgency and freshness
    const now = new Date();
    const scored = available.map(d => {
      const exp = new Date(d.expiryTime);
      const diffHours = (exp - now) / (1000 * 60 * 60);

      let urgencyWeight = 10;
      if (diffHours < 4 && diffHours > 0) urgencyWeight = 50; // highest priority
      else if (diffHours < 8 && diffHours > 0) urgencyWeight = 30;

      // Distance mock score (simulated 2 to 12 km)
      const mockDistanceKm = Math.floor(Math.random() * 8 + 2);

      return {
        ...d,
        distanceKm: mockDistanceKm,
        matchScore: Math.min(99, 60 + urgencyWeight - mockDistanceKm)
      };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      success: true,
      recommendations: scored.slice(0, 6)
    });
  } catch (err) {
    console.error('Error fetching matching donations:', err);
    res.status(500).json({ success: false, message: 'Error computing smart recommendations.' });
  }
});

// @route   GET /api/donations/my-donations
// @desc    Get logged in donor's donations
router.get('/my-donations', protect, authorize('donor', 'admin'), async (req, res) => {
  try {
    const donations = await FoodDonation.find({ donor: req.user.id });
    donations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      donations
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching your donations.' });
  }
});

// @route   GET /api/donations/:id
// @desc    Get single donation by ID
router.get('/:id', async (req, res) => {
  try {
    const donation = await FoodDonation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation listing not found.' });
    }
    res.json({ success: true, donation });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching donation details.' });
  }
});

// @route   POST /api/donations
// @desc    Create a new surplus food donation
router.post('/', protect, authorize('donor', 'admin'), async (req, res) => {
  try {
    const {
      title,
      category,
      quantity,
      unit = 'kg',
      servingsEstimate,
      preparationTime,
      expiryTime,
      description,
      imageUrl,
      pickupAddress,
      pickupWindow,
      contactNumber,
      specialInstructions,
      foodSafetyDeclared,
      lat,
      lng,
      city
    } = req.body;

    if (!title || !category || !quantity || !preparationTime || !expiryTime || !pickupAddress) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (title, category, quantity, prep time, expiry, pickup address).'
      });
    }

    if (!foodSafetyDeclared) {
      return res.status(400).json({
        success: false,
        message: 'You must confirm the food safety and hygienic storage declaration before posting.'
      });
    }

    // Default image selector if none provided
    const categoryImages = {
      'Cooked Food': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      'Fruits & Vegetables': 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80',
      'Bakery & Bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      'Packaged Food': 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80',
      'Dairy Products': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
      'Beverages': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80'
    };

    const finalImage = imageUrl || categoryImages[category] || categoryImages['Cooked Food'];

    // Servings calculation helper if not provided
    const calculatedServings = servingsEstimate || (unit === 'kg' ? Math.round(Number(quantity) * 2.5) : Number(quantity));

    // Latitude & longitude fallback near central coordinates
    const cityCoords = {
      lat: lat ? Number(lat) : 28.6139 + (Math.random() - 0.5) * 0.08,
      lng: lng ? Number(lng) : 77.2090 + (Math.random() - 0.5) * 0.08,
      city: city || 'Central Region'
    };

    const newDonation = await FoodDonation.create({
      donor: req.user.id,
      donorName: req.user.name,
      donorPhone: contactNumber || req.user.phone,
      donorOrganization: req.user.organizationName,
      title,
      category,
      quantity: Number(quantity),
      unit,
      servingsEstimate: calculatedServings,
      preparationTime: new Date(preparationTime),
      expiryTime: new Date(expiryTime),
      description: description || 'Fresh, surplus food packaged safely and ready for prompt collection.',
      imageUrl: finalImage,
      pickupAddress,
      pickupWindow: pickupWindow || 'Available immediately until 2 hours before expiry',
      contactNumber: contactNumber || req.user.phone,
      specialInstructions: specialInstructions || 'Store refrigerated. Transport in clean containers.',
      foodSafetyDeclared: Boolean(foodSafetyDeclared),
      status: 'available',
      location: cityCoords
    });

    // Notify registered NGOs about new surplus food
    const ngos = await User.find({ role: 'ngo' });
    for (const ngo of ngos) {
      await Notification.create({
        recipient: ngo._id || ngo.id,
        sender: req.user.id,
        title: 'New Surplus Food Available Nearby!',
        message: `${req.user.name} just posted "${title}" (${quantity} ${unit}) in ${cityCoords.city}. Request now!`,
        type: 'donation_new',
        link: `/donations`
      });
    }

    res.status(201).json({
      success: true,
      message: 'Surplus food donation successfully published! Nearby NGOs have been alerted.',
      donation: newDonation
    });
  } catch (err) {
    console.error('Error creating donation:', err);
    res.status(500).json({ success: false, message: 'Server error creating food donation.' });
  }
});

// @route   PUT /api/donations/:id
// @desc    Update a food donation
router.put('/:id', protect, async (req, res) => {
  try {
    const donation = await FoodDonation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    if (String(donation.donor) !== String(req.user.id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this donation' });
    }

    const updated = await FoodDonation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'Donation listing updated successfully.', donation: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating donation.' });
  }
});

// @route   DELETE /api/donations/:id
// @desc    Delete or cancel a donation
router.delete('/:id', protect, async (req, res) => {
  try {
    const donation = await FoodDonation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    if (String(donation.donor) !== String(req.user.id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this donation' });
    }

    await FoodDonation.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Donation listing deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting donation.' });
  }
});

module.exports = router;
