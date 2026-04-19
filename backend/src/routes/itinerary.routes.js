const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth.middleware');
const { 
  generateItinerary, 
  saveItinerary, 
  getItineraryHistory, 
  getItineraryById 
} = require('../controllers/itinerary.controller');

// @route POST /api/itinerary/generate-itinerary
router.post('/generate-itinerary', generateItinerary);

// @route POST /api/itinerary/save
router.post('/save', protect, saveItinerary);

// @route GET /api/itinerary/history
router.get('/history', protect, getItineraryHistory);

// @route GET /api/itinerary/:id
router.get('/:id', protect, getItineraryById);

module.exports = router;
