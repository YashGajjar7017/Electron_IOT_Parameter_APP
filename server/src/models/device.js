const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    macAddress: { type: String, required: true, unique: true },
    ipAddress: { type: String, required: true },
    port: { type: Number, required: true },
    notes: { type: String, default: '' },
    status: { type: String, default: 'disconnected' }
  },
  {
    timestamps: true
  }
);

const DeviceModel = mongoose.model('Device', deviceSchema);
module.exports = DeviceModel;
