const mongoose = require('mongoose');

const feedPostSchema = new mongoose.Schema(
  {
    postId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    type: {
      type: String,
      enum: ['NEED_AID', 'OFFER_AID', 'OFFICIAL_HQ_BROADCAST'],
      default: 'NEED_AID'
    },
    category: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    desc: {
      type: String,
      required: true
    },
    location: {
      address: { type: String, default: 'Sector 62 Camp Area' },
      coordinates: { type: [Number], default: [77.3910, 28.5355] }
    },
    distanceKm: {
      type: Number,
      default: 0.5
    },
    author: {
      type: String,
      default: 'Citizen Responder'
    },
    isOfficial: {
      type: Boolean,
      default: false
    },
    confirmedCount: {
      type: Number,
      default: 0
    },
    reportedCount: {
      type: Number,
      default: 0
    },
    comments: [
      {
        user: { type: String },
        text: { type: String },
        time: { type: String }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('FeedPost', feedPostSchema);