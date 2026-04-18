const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema({
  workerId: {
    type: String,
    required: true
  },
  anonymousId: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['Uber', 'Careem', 'Zomato', 'Swiggy', 'Foodpanda', 'Bykea', 'Indriver', 'Other']
  },
  category: {
    type: String,
    required: true,
    enum: ['Rate Change', 'Complaint', 'Deactivation', 'Payment Issue', 'Support Request']
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  city: {
    type: String,
    default: 'Lahore'
  },
  upvotes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CommunityPost', communityPostSchema);
