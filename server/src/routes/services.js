const express = require('express');
const Device = require('../models/device');
const Firmware = require('../models/firmware');
const Group = require('../models/group');
const Deployment = require('../models/deployment');

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const [deviceCount, firmwareCount, groupCount, deploymentCount] = await Promise.all([
      Device.countDocuments(),
      Firmware.countDocuments(),
      Group.countDocuments(),
      Deployment.countDocuments()
    ]);

    res.json({
      deviceCount,
      firmwareCount,
      groupCount,
      deploymentCount,
      updatedAt: new Date().toISOString(),
      engineStatus: 'online'
    });
  } catch (error) {
    res.status(500).json({ error: 'Unable to load service summary' });
  }
});

module.exports = router;
