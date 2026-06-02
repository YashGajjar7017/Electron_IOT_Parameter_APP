const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.get('/', async (_req, res) => {
  const users = await User.find().lean();
  res.json(users);
});

router.post('/', async (req, res) => {
  const { username, email, passwordHash, role } = req.body;
  if (!username || !email || !passwordHash) return res.status(400).json({ error: 'Missing fields' });

  try {
    const u = new User({ username, email, passwordHash, role });
    await u.save();
    res.status(201).json(u);
  } catch (err) {
    res.status(500).json({ error: 'Unable to create user' });
  }
});

module.exports = router;
