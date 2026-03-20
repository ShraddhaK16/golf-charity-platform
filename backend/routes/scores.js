const express = require('express');
const Score = require('../models/Score');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { courseName, date, score } = req.body;
    if (!courseName || !date || score === undefined) {
      return res.status(400).json({ error: 'All fields required' });
    }
    
    // Stableford validation
    if (score < 0 || score > 54) {
      return res.status(400).json({ error: 'Invalid Stableford score (must be between 0 and 54)' });
    }

    const newScore = new Score({
      userId: req.user.userId,
      courseName,
      date,
      score
    });
    
    await newScore.save();
    res.status(201).json(newScore);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const scores = await Score.find({ userId: req.user.userId }).sort({ date: -1 });
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
