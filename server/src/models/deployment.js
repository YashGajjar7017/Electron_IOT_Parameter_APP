const mongoose = require('mongoose');

const deploymentSchema = new mongoose.Schema(
  {
    firmware: { type: mongoose.Schema.Types.ObjectId, ref: 'Firmware', required: true },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    devices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Device' }],
    status: { type: String, enum: ['pending', 'in_progress', 'completed', 'failed'], default: 'pending' },
    startedAt: Date,
    completedAt: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model('Deployment', deploymentSchema);
