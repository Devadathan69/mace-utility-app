const mongoose = require('mongoose');
const StoreItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  stock: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('StoreItem', StoreItemSchema);
