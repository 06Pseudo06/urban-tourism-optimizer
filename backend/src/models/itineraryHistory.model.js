const mongoose = require('mongoose');

const itineraryHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
    },
    destination: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    travelType: {
      type: String,
      trim: true,
    },
    budget: {
      type: String,
      trim: true,
    },
    itineraryData: {
      type: mongoose.Schema.Types.Mixed, // Storing JSON payload
      required: true,
    },
  },
  { timestamps: true }
);

// Compound index for optimal querying of latest user itineraries
itineraryHistorySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('ItineraryHistory', itineraryHistorySchema);
