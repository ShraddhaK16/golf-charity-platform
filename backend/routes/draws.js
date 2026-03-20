const express = require('express');
const Draw = require('../models/Draw');
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const { auth, isAdmin } = require('../middleware/auth');
const router = express.Router();

// Get past draws
router.get('/', async (req, res) => {
  try {
    const draws = await Draw.find().populate('winnerId', 'name email').sort({ date: -1 });
    res.json(draws);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Run a draw (Admin only)
router.post('/run', auth, isAdmin, async (req, res) => {
  try {
    const { prize } = req.body;
    if (!prize) return res.status(400).json({ error: 'Prize name required' });

    // Find all active subscribers
    const activeSubscribers = await Subscription.find({ status: 'active', expiryDate: { $gt: new Date() } });
    
    if (activeSubscribers.length === 0) {
      return res.status(400).json({ error: 'No active subscribers to participate in the draw.' });
    }

    // Pick a random winner
    const randomIndex = Math.floor(Math.random() * activeSubscribers.length);
    const winnerSub = activeSubscribers[randomIndex];

    const draw = new Draw({
      winnerId: winnerSub.userId,
      prize
    });

    await draw.save();
    
    const winner = await User.findById(winnerSub.userId);
    
    res.status(201).json({ message: 'Draw successful', draw: { ...draw.toObject(), winner: { name: winner.name, email: winner.email } } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
