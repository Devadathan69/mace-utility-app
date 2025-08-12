// one-time script to create admin user
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
//const User = require('../models/User');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const salt = await bcrypt.genSalt(10);
  const pw = await bcrypt.hash('admin123', salt);
  const u = new User({ admissionNumber: 'admin', password: pw, role: 'admin', name: 'Admin' });
  await u.save();
  console.log('admin created');
  process.exit();
}
run();
