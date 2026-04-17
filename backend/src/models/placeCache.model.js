const mongoose = require('mongoose');

const placeCacheSchema = new mongoose.Schema({
  originalName: { type: String, required: true }, // Geoapify name used for the lookup
  geoapifyPlaceId: { type: String, unique: true }, // The original geoapify identifier
  
  googlePlaceId: { type: String },
  displayName: { type: String },
  rating: { type: Number, default: 0 },
  userRatingsTotal: { type: Number, default: 0 },
  regularOpeningHours: { type: Object }, // Store the raw opening hours object
  photos: { type: [String] }, // Store direct Google photo URLs
  
  location: {
    lat: Number,
    lng: Number
  },
  
  // Custom normalized data
  normalizedCategory: String,
  avgVisitDuration: Number,
  weatherDependency: String, // 'indoor' | 'outdoor'
  
  cachedAt: {
    type: Date,
    default: Date.now,
    expires: '7d' // TTL index to automatically delete documents after 7 days
  }
});

module.exports = mongoose.model('PlaceCache', placeCacheSchema);
