const express = require('express');
const Deployment = require('../models/deployment');

const router = express.Router();

router.get('/', async (_req, res) => {
  const items = await Deployment.find().populate('firmware group devices').lean();
  res.json(items);
});

router.post('/', async (req, res) => {
  const { firmware, group, devices } = req.body;
  if (!firmware) return res.status(400).json({ error: 'Missing firmware' });
  try {
    const d = new Deployment({ firmware, group, devices, status: 'pending' });
    await d.save();
    res.status(201).json(d);
  } catch (err) {
    res.status(500).json({ error: 'Unable to create deployment' });
  }
});

module.exports = router;
