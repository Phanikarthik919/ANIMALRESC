const express = require('express');
const router = express.Router();
const Rescue = require('../models/Rescue');
const auth = require('../middleware/auth');

// Get all rescues
router.get('/', async (req, res) => {
  try {
    const rescues = await Rescue.find().sort({ createdAt: -1 }).populate('claimedBy', 'name email').populate('reportedBy', 'name email');
    res.json(rescues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Optional auth middleware - sets req.user if token is present but doesn't block
const optionalAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return next();
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    req.user = decoded.user;
  } catch (err) {
    // Token invalid, continue without user
  }
  next();
};

// Create a new rescue request
router.post('/', optionalAuth, async (req, res) => {
  const newRescue = new Rescue({
    title: req.body.title,
    description: req.body.description,
    photoUrl: req.body.photoUrl,
    location: req.body.location,
    needsDonation: req.body.needsDonation,
    donationAmountNeeded: req.body.donationAmountNeeded,
    reportedBy: req.user ? req.user.id : null
  });

  try {
    const savedRescue = await newRescue.save();
    res.status(201).json(savedRescue);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Claim a rescue
router.put('/:id/claim', auth, async (req, res) => {
  try {
    const rescue = await Rescue.findById(req.params.id);
    if (!rescue) return res.status(404).json({ message: 'Rescue not found' });
    
    rescue.status = 'Rescued from Location';
    rescue.claimedBy = req.user.id;
    const updatedRescue = await rescue.save();
    
    // Return populated rescue so frontend has volunteer name if needed
    await updatedRescue.populate('claimedBy', 'name');
    res.json(updatedRescue);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update status of a claimed rescue
router.put('/:id/status', auth, async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['Rescued from Location', 'Rescued and Treated', 'Ready for Adoption', 'Rehomed'];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status transition' });
  }

  try {
    const rescue = await Rescue.findById(req.params.id);
    if (!rescue) return res.status(404).json({ message: 'Rescue not found' });

    // Check if the user is the volunteer who claimed the rescue or an admin
    if (!rescue.claimedBy || (rescue.claimedBy.toString() !== req.user.id && req.user.role !== 'admin')) {
      return res.status(403).json({ message: 'You are not authorized to update this rescue status' });
    }

    rescue.status = status;
    const updatedRescue = await rescue.save();

    await updatedRescue.populate('claimedBy', 'name email');
    res.json(updatedRescue);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Donate to a rescue
router.put('/:id/donate', async (req, res) => {
  try {
    const rescue = await Rescue.findById(req.params.id);
    if (!rescue) return res.status(404).json({ message: 'Rescue not found' });
    
    const amount = Number(req.body.amount);
    rescue.donationAmountRaised += amount;
    const updatedRescue = await rescue.save();
    res.json(updatedRescue);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
