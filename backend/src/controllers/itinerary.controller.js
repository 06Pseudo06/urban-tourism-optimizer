// // @desc    Generate a dummy itinerary
// // @route   POST /api/itinerary/generate-itinerary
// // @access  Public (for now, until Phase 3/4)
// exports.generateItinerary = async (req, res) => {
//   try {
//     const { city, duration, interests } = req.body;

//     // Dummy JSON response to unblock Frontend (Phase 1 Requirement)
//     const dummyItinerary = {
//       success: true,
//       data: {
//         city: city || 'Unknown City',
//         duration: duration || 3,
//         interests: interests || [],
//         places: [
//           { id: 1, name: 'Mock City Park', category: 'nature', rating: 4.5 },
//           { id: 2, name: 'Mock Art Museum', category: 'culture', rating: 4.8 }
//         ],
//         routes: [
//           { day: 1, path: ['Mock City Park', 'Mock Art Museum'], estimatedTime: '4 hours' },
//           { day: 2, path: ['Mock Cafe', 'Mock Historic Monument'], estimatedTime: '5 hours' }
//         ]
//       },
//       message: 'Phase 1 Checkpoint: This is a mock response from the Backend Developer.'
//     };

//     return res.status(200).json(dummyItinerary);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ success: false, message: 'Server Error' });
//   }
// };
const { getPlaces } = require("../services/places.service");
const { getRoutes } = require("../services/routes.service");

exports.generateItinerary = async (req, res) => {
  try {
    const { city, duration, interests } = req.body;

    const places = await getPlaces(city);
    const routes = await getRoutes(places);

    return res.status(200).json({
      success: true,
      data: {
        city: city || "Unknown City",
        duration: duration || 3,
        interests: interests || [],
        places,
        routes
      },
      message: "Itinerary generated using integration services"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};