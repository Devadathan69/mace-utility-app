const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const User = require('../models/User');
const auth = require('../middleware/auth');

// Login
router.post('/login', async (req, res) => {
  const { admissionNumber, password } = req.body;
  if (!admissionNumber || !password) return res.status(400).json({ message: 'Provide creds' });
  const user = await User.findOne({ admissionNumber });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
  const token = jwt.sign({
    id: user._id,
    admissionNumber: user.admissionNumber,
    role: user.role
  }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, user: { admissionNumber: user.admissionNumber, role: user.role, name: user.name } });
});

// change password
router.post('/change-password', auth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);
  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) return res.status(400).json({ message: 'Old password incorrect' });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();
  res.json({ message: 'Password updated' });
});

// get current user
router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

module.exports = router;
