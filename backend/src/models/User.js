const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    badgeId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true
    },
    pin: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: 'Field Rescuer'
    },
    userType: {
      type: String,
      enum: ['rescuer', 'authority'],
      default: 'rescuer'
    },
    status: {
      type: String,
      enum: ['AVAILABLE', 'EN_ROUTE', 'ON_SITE', 'OFFLINE'],
      default: 'AVAILABLE'
    },
    currentLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [77.3910, 28.5355]
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);