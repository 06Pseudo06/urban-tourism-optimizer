const axios = require("axios");

const getPlaces = async (req, res) => {
  try {
    const { city } = req.query;

    const response = await axios.get(
      `https://api.geoapify.com/v2/places?categories=tourism.sights&filter=place:${city}&apiKey=${process.env.GEOAPIFY_API_KEY}`
    );

    
    const places = response.data.features.map(place => ({
      name: place.properties.name,
      address: place.properties.formatted,
      lat: place.geometry.coordinates[1],
      lon: place.geometry.coordinates[0],
    }));

    res.json({ places });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPlaces };