const express = require('express');
const router = express.Router();
const { generateItinerary } = require('../controllers/itinerary.controller');

// @route POST /api/itinerary/generate-itinerary
router.post('/generate-itinerary', generateItinerary);

module.exports = router;
