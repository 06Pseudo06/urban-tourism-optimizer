const express = require('express');
const router = express.Router();

// Real places route utilizing Geoapify API
router.post('/search', async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const apiKey = process.env.GEOAPIFY_API_KEY;
    if (!apiKey) {
      console.error("GEOAPIFY_API_KEY is not defined in .env file.");
      return res.status(500).json({ error: "Server configuration error." });
    }

    const geoapifyUrl = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&type=city&format=json&apiKey=${apiKey}`;
    
    // Using native NodeJS fetch (requires Node 18+)
    const response = await fetch(geoapifyUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Geoapify hit error:", errorText);
      return res.status(response.status).json({ error: "Failed to fetch from Geoapify" });
    }

    const data = await response.json();
    
    // Format JSON array for frontend autocomplete list
    // Geoapify Geocoding API returns 'features' for autocomplete/search
    if (data && data.features) {
      return res.json(data.features);
    } else if (data && data.results) { // fallback just in case some other geoapify version is used
      return res.json(data.results);
    } else {
      return res.json([]);
    }
  } catch (error) {
    console.error("Error connecting to Geoapify:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
