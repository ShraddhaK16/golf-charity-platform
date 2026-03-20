const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseName: { type: String, required: true },
  date: { type: Date, required: true },
  score: { type: Number, required: true }, // Stableford score (usually 0-54)
});

module.exports = mongoose.model('Score', scoreSchema);
