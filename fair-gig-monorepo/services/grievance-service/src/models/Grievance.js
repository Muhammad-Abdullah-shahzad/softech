const mongoose = require('mongoose');

const grievanceSchema = new mongoose.Schema({
  workerId: {
    type: String,
    required: true,
    index: true
  },
  earningId: {
    type: String, // Reference to Earning record (REST-based link)
    required: true
  },
  issueType: {
    type: String,
    enum: ['underpayment', 'platform_error', 'unjust_deduction', 'other'],
    required: true
  },
  description: String,
  status: {
    type: String,
    enum: ['open', 'investigating', 'clustered', 'resolved'],
    default: 'open'
  },
  clusterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cluster'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Grievance', grievanceSchema);
