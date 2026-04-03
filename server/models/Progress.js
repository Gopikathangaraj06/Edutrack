const mongoose = require('mongoose');

const progressSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  subjectId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Subject' },
  score: { type: Number, required: true },
  date: { type: Date, required: true, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('Progress', progressSchema);
