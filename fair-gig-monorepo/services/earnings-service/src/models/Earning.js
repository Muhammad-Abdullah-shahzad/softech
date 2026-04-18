const mongoose = require('mongoose');

const earningSchema = new mongoose.Schema({
  workerId: {
    type: String,
    required: true,
    index: true
  },
  platform: {
    type: String,
    required: true,

  },
  shiftStart: {
    type: Date,
    required: true
  },
  shiftEnd: {
    type: Date,
    required: true
  },
  grossAmount: {
    type: Number,
    required: true
  },
  deductions: [{
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    description: String
  }],
  netAmount: {
    type: Number,
    required: true
  },
  evidenceUrls: [{
    type: String // Cloud storage URLs for screenshots
  }],
  verificationStatus: {
    type: String,
    enum: ['unverified', 'pending', 'verified', 'flagged'],
    default: 'unverified'
  },
  anomalyScore: {
    type: Number,
    default: 0
  },
  anomalies: [{
    type: { type: String },
    severity: String,
    message: String,
    details: String,
    affectedDates: [String],
    suggestion: String
  }],
  metadata: {
    type: Map,
    of: String
  },
  city: {
    type: String,
    required: true,
    default: 'Lahore'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Earning', earningSchema);
