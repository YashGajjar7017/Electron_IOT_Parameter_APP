const express = require('express');
const Firmware = require('../models/firmware');

const router = express.Router();

router.get('/', async (_req, res) => {
  const items = await Firmware.find().lean();
  res.json(items);
});

router.post('/', async (req, res) => {
  const { name, version, fileUrl, size, checksum } = req.body;
  if (!name || !version || !fileUrl) return res.status(400).json({ error: 'Missing fields' });
  try {
    const f = new Firmware({ name, version, fileUrl, size, checksum });
    await f.save();
    res.status(201).json(f);
  } catch (err) {
    res.status(500).json({ error: 'Unable to create firmware' });
  }
});

module.exports = router;
