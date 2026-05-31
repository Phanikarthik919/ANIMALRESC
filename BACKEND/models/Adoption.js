const mongoose = require('mongoose');

const AdoptionSchema = new mongoose.Schema({
  rescue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rescue',
    required: true
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  housePhotos: {
    type: [String],
    default: []
  },
  aadharPhoto: {
    type: String,
    required: true
  },
  safetyChecks: {
    secureFencing: { type: Boolean, default: false },
    noHazards: { type: Boolean, default: false },
    caretakerCommitted: { type: Boolean, default: false },
    consentHomeChecks: { type: Boolean, default: false }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Adoption', AdoptionSchema);
