const express = require('express');
const Subscription = require('../models/Subscription');
const Charity = require('../models/Charity');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Mock a payment checkout and subscribe
router.post('/subscribe', auth, async (req, res) => {
  try {
    const { plan, charityId } = req.body; // plan: 'monthly' | 'yearly'
    if (!['monthly', 'yearly'].includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    // Check if active sub exists
    const existing = await Subscription.findOne({ userId: req.user.userId, status: 'active' });
    if (existing) {
      return res.status(400).json({ error: 'You already have an active subscription' });
    }

    const expiryDate = new Date();
    const amount = plan === 'monthly' ? 20 : 200; // Mock prices $20/mo, $200/yr
    if (plan === 'monthly') {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    } else {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    }

    const subscription = new Subscription({
      userId: req.user.userId,
      plan,
      expiryDate,
      charityId: charityId || null,
      status: 'active'
    });
    
    await subscription.save();

    // Add 10% to charity if selected
    if (charityId) {
      const charity = await Charity.findById(charityId);
      if (charity) {
        charity.totalDonations += (amount * 0.1);
        await charity.save();
      }
    }

    res.status(201).json({ message: 'Subscribed successfully (mock)', subscription });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user.userId }).populate('charityId');
    if (!subscription) return res.status(404).json({ error: 'No subscription found' });
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
