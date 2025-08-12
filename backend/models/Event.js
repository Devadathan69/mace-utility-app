const mongoose = require('mongoose');
const EventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  location: String,
  requiresRegistration: { type: Boolean, default: false },
  registrations: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    admissionNumber: String,
    name: String,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Event', EventSchema);
