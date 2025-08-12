const mongoose = require('mongoose');
const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreItem' },
  qty: Number,
  token: { type: String, unique: true },
  paid: { type: Boolean, default: false },
  method: { type: String, enum: ['cash', 'online'], default: 'cash' },
  used: { type: Boolean, default: false },
  expiresAt: Date,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Booking', BookingSchema);
