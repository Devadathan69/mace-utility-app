const express = require('express');
const router = express.Router();
const StoreItem = require('../models/StoreItem');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { v4: uuidv4 } = require('uuid');

router.get('/', async (req, res) => {
  const items = await StoreItem.find();
  res.json(items);
});

router.post('/', auth, admin, async (req, res) => {
  const it = new StoreItem(req.body);
  await it.save();
  res.json(it);
});

router.post('/book', auth, async (req, res) => {
  const { itemId, qty = 1, method = 'cash' } = req.body;
  const item = await StoreItem.findById(itemId);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  if (item.stock < qty) return res.status(400).json({ message: 'Not enough stock' });

  item.stock -= qty;
  await item.save();

  const token = uuidv4();
  const expiresAt = new Date(Date.now() + (1000 * 60 * 60 * (+process.env.TOKEN_EXPIRE_HOURS || 24)));

  const booking = new Booking({
    userId: req.user.id,
    itemId,
    qty,
    token,
    method,
    expiresAt
  });
  await booking.save();
  res.json({ token, expiresAt });
});

router.post('/verify', auth, admin, async (req, res) => {
  const { token } = req.body;
  const booking = await Booking.findOne({ token }).populate('itemId');
  if (!booking) return res.status(404).json({ message: 'Token invalid' });
  if (booking.used) return res.status(400).json({ message: 'Already used' });
  if (new Date() > booking.expiresAt) return res.status(400).json({ message: 'Expired' });
  booking.used = true;
  await booking.save();
  res.json({ message: 'Token valid', booking });
});

module.exports = router;
