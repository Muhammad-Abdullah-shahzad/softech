const mongoose = require('mongoose');

const clusterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  platform: String,
  patternDescription: String,
  grievanceCount: {
    type: Number,
    default: 0
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'archived'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Cluster', clusterSchema);
