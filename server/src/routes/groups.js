const express = require('express');
const Group = require('../models/group');

const router = express.Router();

router.get('/', async (_req, res) => {
  const items = await Group.find().populate('devices').lean();
  res.json(items);
});

router.post('/', async (req, res) => {
  const { name, description, devices } = req.body;
  if (!name) return res.status(400).json({ error: 'Missing name' });
  try {
    const g = new Group({ name, description, devices });
    await g.save();
    res.status(201).json(g);
  } catch (err) {
    res.status(500).json({ error: 'Unable to create group' });
  }
});

module.exports = router;
