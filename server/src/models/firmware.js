const mongoose = require('mongoose');

const firmwareSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    version: { type: String, required: true },
    fileUrl: { type: String, required: true },
    size: { type: Number },
    checksum: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Firmware', firmwareSchema);
