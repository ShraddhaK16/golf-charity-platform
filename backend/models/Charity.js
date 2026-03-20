const mongoose = require('mongoose');

const charitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  totalDonations: { type: Number, default: 0 } // Tracks total amount generated for this charity by subs
});

module.exports = mongoose.model('Charity', charitySchema);
