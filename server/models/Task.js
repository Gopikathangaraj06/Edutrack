const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  title: { type: String, required: true },
  subject: { type: String },
  completed: { type: Boolean, default: false },
  date: { type: Date, required: true, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
