const mongoose = require('mongoose');

const RescueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  photoUrl: {
    type: String,
    default: ''
  },
  location: {
    lat: { type: Number },
    lng: { type: Number },
    address: { type: String }
  },
  status: {
    type: String,
    enum: ['Pending', 'Rescued from Location', 'Rescued and Treated', 'Ready for Adoption', 'Rehomed'],
    default: 'Pending'
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  needsDonation: {
    type: Boolean,
    default: false
  },
  donationAmountNeeded: {
    type: Number,
    default: 0
  },
  donationAmountRaised: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Rescue', RescueSchema);
