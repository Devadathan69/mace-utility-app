const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', async (req, res) => {
  const events = await Event.find().sort({ date: 1 });
  res.json(events);
});

router.post('/', auth, admin, async (req, res) => {
  const ev = new Event(req.body);
  await ev.save();
  res.json(ev);
});

router.put('/:id', auth, admin, async (req, res) => {
  const ev = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(ev);
});

router.delete('/:id', auth, admin, async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

router.post('/:id/register', auth, async (req, res) => {
  const ev = await Event.findById(req.params.id);
  if (!ev) return res.status(404).json({ message: 'Event not found' });
  ev.registrations.push({
    userId: req.user.id,
    admissionNumber: req.user.admissionNumber,
    name: req.body.name || ''
  });
  await ev.save();
  res.json({ message: 'Registered' });
});

module.exports = router;
