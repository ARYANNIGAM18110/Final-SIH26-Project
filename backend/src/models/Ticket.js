const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    dispatchId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    safeCode: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Critical Panic SOS',
        'Medical Emergency',
        'Flood Evacuation',
        'Structural Collapse',
        'Fire Breakout',
        'General Distress'
      ],
      default: 'Medical Emergency'
    },
    text: {
      type: String,
      required: true
    },
    language: {
      type: String,
      default: 'English'
    },
    langFlag: {
      type: String,
      default: '🇺🇸'
    },
    photo: {
      type: String,
      default: null
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
      },
      address: {
        type: String,
        default: 'GPS Live Coordinates Acquired'
      },
      city: {
        type: String,
        default: 'Noida Regional Hub'
      }
    },
    status: {
      type: String,
      enum: ['ACTIVE_DISPATCH', 'RESCUE_NOTIFIED', 'RESOLVED', 'CANCELLED_BY_USER'],
      default: 'ACTIVE_DISPATCH',
      index: true
    },
    assignedOfficer: {
      type: String,
      default: 'Unassigned'
    },
    assignedUnitId: {
      type: String,
      default: null
    },
    proofData: {
      notes: { type: String, default: null },
      verifiedSafeCode: { type: String, default: null },
      submittedAt: { type: Date, default: null }
    },
    resolvedAt: {
      date: { type: String, default: null },
      time: { type: String, default: null },
      timestamp: { type: Date, default: null }
    }
  },
  {
    timestamps: true
  }
);

ticketSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Ticket', ticketSchema);