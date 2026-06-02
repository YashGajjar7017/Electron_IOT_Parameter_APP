const express = require('express');
const DeviceModel = require('../models/device');

const router = express.Router();

router.get('/', async (_req, res) => {
  const devices = await DeviceModel.find().sort({ createdAt: -1 }).lean();
  return res.json(devices);
});

router.post('/', async (req, res) => {
  const { name, macAddress, ipAddress, port, notes } = req.body;

  if (!name || !macAddress || !ipAddress || !port) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const device = new DeviceModel({
      name,
      macAddress,
      ipAddress,
      port: Number(port),
      notes,
      status: 'disconnected'
    });

    await device.save();
    return res.status(201).json(device);
  } catch (error) {
    return res.status(500).json({ error: 'Unable to save device configuration' });
  }
});

module.exports = router;
