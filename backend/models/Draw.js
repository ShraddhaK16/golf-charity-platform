const mongoose = require('mongoose');

const drawSchema = new mongoose.Schema({
  winnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  prize: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Draw', drawSchema);
