const mongoose = require('mongoose');

const accessLogSchema = new mongoose.Schema(
  {
    entrantId: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['Volunteer', 'Medical Staff', 'Military Liaison', 'Visitor'],
      default: 'Visitor'
    },
    idNumber: {
      type: String,
      required: true
    },
    zone: {
      type: String,
      default: 'Command HQ Hub'
    },
    timeIn: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'CHECKED_OUT'],
      default: 'ACTIVE'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('AccessLog', accessLogSchema);