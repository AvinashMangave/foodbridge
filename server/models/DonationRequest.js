const mongoose = require('mongoose');
const { createAdaptiveModel } = require('./modelFactory');

const donationRequestSchema = new mongoose.Schema({
  donation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodDonation',
    required: true
  },
  donationTitle: {
    type: String,
    required: true
  },
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ngoName: {
    type: String,
    required: true
  },
  ngoPhone: {
    type: String,
    default: ''
  },
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  donorName: {
    type: String,
    required: true
  },
  requestedQuantity: {
    type: Number,
    required: true
  },
  servingsNeeded: {
    type: Number,
    default: 1
  },
  purposeNote: {
    type: String,
    required: true
  },
  pickupEstimatedTime: {
    type: String,
    default: 'Within 2 hours'
  },
  pickupCode: {
    type: String,
    default: () => 'FB-' + Math.floor(1000 + Math.random() * 9000)
  },
  status: {
    type: String,
    enum: [
      'pending',
      'approved',
      'rejected',
      'ready_for_pickup',
      'picked_up',
      'delivered',
      'cancelled'
    ],
    default: 'pending'
  },
  statusHistory: [
    {
      status: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
      updatedBy: { type: String, default: 'System' },
      note: { type: String, default: '' }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = createAdaptiveModel('DonationRequest', donationRequestSchema, 'donationRequests');
