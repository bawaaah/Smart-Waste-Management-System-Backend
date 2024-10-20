// models/Device.js
const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    unique: true,
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive", "Malfunction"],
    default: "Active",
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  spaceLeft: {
    type: Number,
    required: true,
  },
  deviceType: {
    type: String,
  },
  capacity: {
    type: Number,
    required: true,
  },
  qrCode: {
    // New field for QR code
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model
    required: true,
  },
});

module.exports = mongoose.model("Device", DeviceSchema);
