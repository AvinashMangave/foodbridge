const mongoose = require('mongoose');
const { createAdaptiveModel } = require('./modelFactory');

const foodDonationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  donorName: {
    type: String,
    required: true
  },
  donorPhone: {
    type: String,
    default: ''
  },
  donorOrganization: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Cooked Food',
      'Fruits & Vegetables',
      'Bakery & Bread',
      'Packaged Food',
      'Dairy Products',
      'Beverages',
      'Other'
    ],
    default: 'Cooked Food'
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unit: {
    type: String,
    enum: ['kg', 'servings', 'packets', 'boxes', 'liters'],
    default: 'kg'
  },
  servingsEstimate: {
    type: Number,
    default: 1
  },
  preparationTime: {
    type: Date,
    required: true
  },
  expiryTime: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
  },
  pickupAddress: {
    type: String,
    required: true
  },
  pickupWindow: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  specialInstructions: {
    type: String,
    default: 'Store in cool dry conditions. Keep covered.'
  },
  foodSafetyDeclared: {
    type: Boolean,
    required: true,
    default: true
  },
  status: {
    type: String,
    enum: [
      'available',
      'requested',
      'approved',
      'ready_for_pickup',
      'picked_up',
      'delivered',
      'cancelled'
    ],
    default: 'available'
  },
  location: {
    lat: { type: Number, default: 28.6139 },
    lng: { type: Number, default: 77.2090 },
    city: { type: String, default: 'Central City' }
  },
  activeRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DonationRequest',
    default: null
  },
  claimedByNgo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  claimedByNgoName: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = createAdaptiveModel('FoodDonation', foodDonationSchema, 'foodDonations');
