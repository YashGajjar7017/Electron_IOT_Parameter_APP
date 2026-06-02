const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    devices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Device' }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Group', groupSchema);
