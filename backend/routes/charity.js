const express = require('express');
const Charity = require('../models/Charity');
const router = express.Router();

// Get all charities
router.get('/', async (req, res) => {
  try {
    const charities = await Charity.find();
    res.json(charities);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Seed charities - handy for initial setup
router.post('/seed', async (req, res) => {
  try {
    const count = await Charity.countDocuments();
    if (count > 0) return res.json({ message: 'Already seeded' });

    const charities = [
      { name: 'Golfers Against Cancer', description: 'Raising funds for cancer research globally.' },
      { name: 'Junior Golf Foundation', description: 'Helping kids learn and grow through golf.' },
      { name: 'Green Earth Fund', description: 'Promoting eco-friendly golf course maintenance.' }
    ];

    await Charity.insertMany(charities);
    res.json({ message: 'Charities seeded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
