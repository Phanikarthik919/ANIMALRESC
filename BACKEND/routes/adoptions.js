const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Adoption = require('../models/Adoption');
const Rescue = require('../models/Rescue');

// @route   POST api/adoptions
// @desc    Submit a new adoption application
// @access  Private
router.post('/', auth, async (req, res) => {
  const { rescueId, phone, address, message, aadharPhoto, housePhotos } = req.body;

  if (!phone || !address || !aadharPhoto) {
    return res.status(400).json({ message: 'Phone number, home address, and Aadhar photo ID proof are required' });
  }

  try {
    const rescue = await Rescue.findById(rescueId);
    if (!rescue) {
      return res.status(404).json({ message: 'Rescue animal not found' });
    }

    if (rescue.status !== 'Ready for Adoption') {
      return res.status(400).json({ message: 'This animal is not ready for adoption yet' });
    }

    // Check if duplicate application exists
    const existing = await Adoption.findOne({ rescue: rescueId, applicant: req.user.id });
    if (existing) {
      return res.status(400).json({ message: 'You have already submitted an adoption application for this animal' });
    }

    const newAdoption = new Adoption({
      rescue: rescueId,
      applicant: req.user.id,
      phone,
      address,
      aadharPhoto,
      housePhotos: housePhotos || [],
      message: message || '',
      safetyChecks: {
        secureFencing: false,
        noHazards: false,
        caretakerCommitted: false,
        consentHomeChecks: false
      }
    });

    const savedAdoption = await newAdoption.save();
    res.status(201).json(savedAdoption);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET api/adoptions/rescue/:rescueId
// @desc    Get all adoption applications for a specific rescue
// @access  Private
router.get('/rescue/:rescueId', auth, async (req, res) => {
  try {
    const rescue = await Rescue.findById(req.params.rescueId);
    if (!rescue) {
      return res.status(404).json({ message: 'Rescue animal not found' });
    }

    // Authorize: only the claiming volunteer or admin can see applications
    if (!rescue.claimedBy || (rescue.claimedBy.toString() !== req.user.id && req.user.role !== 'admin')) {
      return res.status(403).json({ message: 'You are not authorized to view applications for this rescue' });
    }

    const adoptions = await Adoption.find({ rescue: req.params.rescueId })
      .populate('applicant', 'name email')
      .populate('rescue', 'title type status')
      .sort({ createdAt: -1 });

    res.json(adoptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET api/adoptions
// @desc    Get all adoption applications for all rescues claimed by the user (or all if admin). For normal users, get their submitted applications.
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role === 'user') {
      const adoptions = await Adoption.find({ applicant: req.user.id })
        .populate('applicant', 'name email')
        .populate('rescue', 'title type status photoUrl')
        .sort({ createdAt: -1 });
      return res.json(adoptions);
    }

    let rescueQuery = {};
    if (req.user.role === 'volunteer') {
      rescueQuery = { claimedBy: req.user.id };
    }
    
    // Find all rescues owned by user
    const rescues = await Rescue.find(rescueQuery).select('_id');
    const rescueIds = rescues.map(r => r._id);

    // Get all adoptions for those rescues
    const adoptions = await Adoption.find({ rescue: { $in: rescueIds } })
      .populate('applicant', 'name email')
      .populate('rescue', 'title type status photoUrl')
      .sort({ createdAt: -1 });

    res.json(adoptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// @route   PUT api/adoptions/:id/status
// @desc    Approve or reject an adoption application
// @access  Private
router.put('/:id/status', auth, async (req, res) => {
  const { status, safetyChecks } = req.body;

  if (status && !['Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status update' });
  }

  try {
    const adoption = await Adoption.findById(req.params.id);
    if (!adoption) {
      return res.status(404).json({ message: 'Adoption application not found' });
    }

    const rescue = await Rescue.findById(adoption.rescue);
    if (!rescue) {
      return res.status(404).json({ message: 'Rescue animal associated with this application not found' });
    }

    // Authorize: only the claiming volunteer or admin can update application status
    if (!rescue.claimedBy || (rescue.claimedBy.toString() !== req.user.id && req.user.role !== 'admin')) {
      return res.status(403).json({ message: 'You are not authorized to manage this application' });
    }

    // Save safety checks if provided
    if (safetyChecks) {
      adoption.safetyChecks = safetyChecks;
    }

    if (status === 'Approved') {
      // Enforce that all safety checks are passed
      const checks = adoption.safetyChecks;
      if (!checks.secureFencing || !checks.noHazards || !checks.caretakerCommitted || !checks.consentHomeChecks) {
        return res.status(400).json({ message: 'Cannot approve adoption. All safety standards checklist conditions must be met.' });
      }

      // 1. Approve this application
      adoption.status = 'Approved';
      await adoption.save();

      // 2. Reject all other pending applications for this rescue
      await Adoption.updateMany(
        { rescue: adoption.rescue, _id: { $ne: adoption._id }, status: 'Pending' },
        { status: 'Rejected' }
      );

      // 3. Mark the rescue animal as Rehomed
      rescue.status = 'Rehomed';
      await rescue.save();
    } else if (status === 'Rejected') {
      // Reject this application
      adoption.status = 'Rejected';
      await adoption.save();
    } else {
      // Just save safetyChecks changes
      await adoption.save();
    }

    res.json(adoption);
  } catch (err) {
    res.status(550).json({ message: err.message });
  }
});

module.exports = router;
