const express = require('express');
const router = express.Router();
const CanteenOrder = require('../models/CanteenOrder');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { v4: uuidv4 } = require('uuid');

router.get('/menu', async (req, res) => {
  const menu = [
    { id: 'm1', name: 'Veg Meal', price: 40 },
    { id: 'm2', name: 'Tea', price: 10 }
  ];
  res.json(menu);
});

router.post('/order', auth, async (req, res) => {
  const { items, total, paid = false } = req.body;
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * (+process.env.TOKEN_EXPIRE_HOURS || 24));
  const order = new CanteenOrder({
    userId: req.user.id,
    items,
    total,
    token,
    paid,
    expiresAt
  });
  await order.save();
  res.json({ token, expiresAt });
});

router.post('/verify', auth, admin, async (req, res) => {
  const { token } = req.body;
  const order = await CanteenOrder.findOne({ token });
  if (!order) return res.status(404).json({ message: 'Invalid token' });
  if (order.used) return res.status(400).json({ message: 'Already used' });
  if (new Date() > order.expiresAt) return res.status(400).json({ message: 'Expired' });
  order.used = true;
  await order.save();
  res.json({ message: 'Valid order', order });
});

module.exports = router;
