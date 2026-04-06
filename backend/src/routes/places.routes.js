// const express = require('express');
// const router = express.Router();

// // Real places route utilizing Geoapify API
// router.post('/search', async (req, res) => {
//   const { query } = req.body;
//   if (!query) {
//     return res.status(400).json({ error: "Query is required" });
//   }

//   try {
//     const apiKey = process.env.GEOAPIFY_API_KEY;
//     if (!apiKey) {
//       console.error("GEOAPIFY_API_KEY is not defined in .env file.");
//       return res.status(500).json({ error: "Server configuration error." });
//     }

//     const geoapifyUrl = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&type=city&format=json&apiKey=${apiKey}`;
    
//     // Using native NodeJS fetch (requires Node 18+)
//     const response = await fetch(geoapifyUrl);
    
//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("Geoapify hit error:", errorText);
//       return res.status(response.status).json({ error: "Failed to fetch from Geoapify" });
//     }

//     const data = await response.json();
    
//     // Format JSON array for frontend autocomplete list
//     if (data && data.results) {
//       return res.json(data.results);
//     } else {
//       return res.json([]);
//     }
//   } catch (error) {
//     console.error("Error connecting to Geoapify:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// module.exports = router;
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

    const response = await fetch(geoapifyUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Geoapify hit error:", errorText);
      return res.status(response.status).json({ error: "Failed to fetch from Geoapify" });
    }

    const data = await response.json();

    // ✅ FORMAT CHANGE (IMPORTANT FOR PHASE 4)
    const places = (data.results || []).map(place => ({
      name: place.city || place.name || "Unknown",
      address: place.formatted || "No address",
      lat: place.lat,
      lon: place.lon,
    }));

    return res.json({ places });

  } catch (error) {
    console.error("Error connecting to Geoapify:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;