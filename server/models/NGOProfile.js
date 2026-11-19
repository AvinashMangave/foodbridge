const mongoose = require('mongoose');
const { createAdaptiveModel } = require('./modelFactory');

const ngoProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organizationName: {
    type: String,
    required: true
  },
  registrationNumber: {
    type: String,
    default: ''
  },
  focusArea: {
    type: String,
    default: 'Community Food Bank & Child Welfare'
  },
  dailyCapacityServings: {
    type: Number,
    default: 150
  },
  coverageRadiusKm: {
    type: Number,
    default: 15
  },
  verified: {
    type: Boolean,
    default: true
  },
  address: {
    type: String,
    default: ''
  },
  operatingHours: {
    type: String,
    default: '8:00 AM - 10:00 PM'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = createAdaptiveModel('NGOProfile', ngoProfileSchema, 'ngoProfiles');
