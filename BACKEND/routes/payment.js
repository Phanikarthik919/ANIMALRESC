const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Rescue = require('../models/Rescue');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret'
});

// @route   POST /api/payment/create-order
// @desc    Create a Razorpay order for a donation
router.post('/create-order', async (req, res) => {
  try {
    const { amount, rescueId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Verify rescue exists
    const rescue = await Rescue.findById(rescueId);
    if (!rescue) {
      return res.status(404).json({ message: 'Rescue not found' });
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `don_${rescueId.slice(-8)}_${Date.now().toString(36)}`,
      notes: {
        rescueId: rescueId,
        rescueTitle: rescue.title,
        purpose: 'Animal Rescue Donation'
      }
    };

    const order = await razorpay.orders.create(options);
    
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder'
    });
  } catch (err) {
    console.error('Razorpay order creation error:', err.message || err);
    console.error('Razorpay error details:', JSON.stringify(err.error || err, null, 2));
    console.error('Key ID being used:', process.env.RAZORPAY_KEY_ID);
    res.status(500).json({ message: err.error?.description || err.message || 'Failed to create payment order' });
  }
});

// @route   POST /api/payment/verify
// @desc    Verify Razorpay payment signature and update donation
router.post('/verify', async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      rescueId, 
      amount 
    } = req.body;

    // Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret';
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed. Invalid signature.' });
    }

    // Payment verified — update rescue donation amount
    const rescue = await Rescue.findById(rescueId);
    if (!rescue) {
      return res.status(404).json({ message: 'Rescue not found' });
    }

    const donationAmount = amount / 100; // Convert from paise back to rupees
    rescue.donationAmountRaised += donationAmount;
    await rescue.save();

    res.json({ 
      success: true, 
      message: 'Payment verified and donation recorded successfully',
      amountDonated: donationAmount,
      totalRaised: rescue.donationAmountRaised
    });
  } catch (err) {
    console.error('Payment verification error:', err);
    res.status(500).json({ message: 'Payment verification failed' });
  }
});

module.exports = router;
