const mongoose = require('mongoose');
const CanteenOrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    itemName: String,
    qty: Number,
    price: Number
  }],
  total: Number,
  token: { type: String, unique: true },
  paid: { type: Boolean, default: false },
  used: { type: Boolean, default: false },
  expiresAt: Date,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('CanteenOrder', CanteenOrderSchema);
