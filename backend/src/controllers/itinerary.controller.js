// @desc    Generate a dummy itinerary
// @route   POST /api/itinerary/generate-itinerary
// @access  Public (for now, until Phase 3/4)
exports.generateItinerary = async (req, res) => {
  try {
    const { city, duration, interests } = req.body;
    
    const apiKey = process.env.GEOAPIFY_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: 'Geoapify API key is missing' });
    }

    // Default duration to 3 days if not provided or invalid
    const tripDuration = parseInt(duration) || 3;
    const targetCity = city || 'Unknown City';

    // 1. Resolve city to place_id using Geoapify Geocoding API
    const geocodeUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(targetCity)}&format=json&apiKey=${apiKey}`;
    const geocodeRes = await fetch(geocodeUrl);
    
    if (!geocodeRes.ok) {
      return res.status(500).json({ success: false, message: "Failed to perform geocoding for the city" });
    }
    
    const geocodeData = await geocodeRes.json();
    if (!geocodeData.results || geocodeData.results.length === 0) {
      return res.status(404).json({ success: false, message: "City not found in Geoapify" });
    }
    
    const placeId = geocodeData.results[0].place_id;

    // 2. Fetch real places/attractions within this place_id using Geoapify Places API
    // Categories: tourism attractions, catering/restaurants, entertainment
    const placesLimit = Math.max(10, tripDuration * 4); // Fetch enough for the trip length
    const placesUrl = `https://api.geoapify.com/v2/places?categories=tourism.attraction,catering.restaurant,entertainment,leisure&filter=place:${placeId}&limit=${placesLimit}&apiKey=${apiKey}`;
    
    const placesRes = await fetch(placesUrl);
    if (!placesRes.ok) {
      return res.status(500).json({ success: false, message: "Failed to fetch places" });
    }
    
    const placesData = await placesRes.json();
    const features = placesData.features || [];

    // 3. Map into the expected `places` array format
    let actualPlaces = features
      .map((f, i) => {
        const props = f.properties;
        return {
          id: props.place_id || i,
          name: props.name || "Unnamed Point of Interest",
          category: props.categories?.[0]?.split('.')[0] || 'attraction',
          rating: typeof props.rating !== 'undefined' ? props.rating : parseFloat((Math.random() * 2 + 3).toFixed(1)) // randomize if no rating provided
        };
      })
      .filter(p => p.name !== "Unnamed Point of Interest");

    // Remove duplicates by name
    const seen = new Set();
    actualPlaces = actualPlaces.filter(p => {
      if(seen.has(p.name)) return false;
      seen.add(p.name);
      return true;
    });

    // 4. Create the `routes` itinerary mapped per day
    const routes = [];
    let placeIndex = 0;
    
    for (let day = 1; day <= tripDuration; day++) {
      const dayPlaces = [];
      // Distribute approx 3 places per day
      for(let j=0; j<3 && placeIndex < actualPlaces.length; j++) {
          dayPlaces.push(actualPlaces[placeIndex].name);
          placeIndex++;
      }
      
      if (dayPlaces.length > 0) {
          routes.push({
              day,
              path: dayPlaces,
              estimatedTime: `${dayPlaces.length * 2} hours` // dummy estimate based on count
          });
      }
    }

    const realItinerary = {
      success: true,
      data: {
        city: targetCity,
        duration: tripDuration,
        interests: interests || [],
        places: actualPlaces,
        routes: routes
      },
      message: 'Successfully generated real itinerary using Geoapify APIs!'
    };

    return res.status(200).json(realItinerary);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};
