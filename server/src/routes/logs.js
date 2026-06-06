const express = require('express');

const router = express.Router();

router.get('/', (_req, res) => {
  const logs = [
    {
      id: 'log-1',
      timestamp: Date.now() - 45000,
      level: 'info',
      message: 'Backend service started and connected to MongoDB.'
    },
    {
      id: 'log-2',
      timestamp: Date.now() - 18000,
      level: 'info',
      message: 'Device registry loaded from the database.'
    },
    {
      id: 'log-3',
      timestamp: Date.now() - 6000,
      level: 'debug',
      message: 'Health check endpoint responded successfully.'
    }
  ];
  res.json(logs);
});

module.exports = router;
