const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.post('/generate', auth, async (req, res) => {
  res.json({ message: 'Quiz generation placeholder', body: req.body });
});

module.exports = router;
