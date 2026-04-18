const mongoose = require('mongoose');

const broadcastSchema = new mongoose.Schema({
  author: {
    type: String, // Advocate ID or role
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 500
  },
  roles: [{
    type: String, // e.g. ['worker']
    default: ['worker']
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Broadcast', broadcastSchema);
