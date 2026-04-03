const mongoose = require('mongoose');

const subjectSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  totalTests: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  improvement: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Subject', subjectSchema);
