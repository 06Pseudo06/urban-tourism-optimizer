require('dotenv').config();
const { generateItinerary } = require('./src/controllers/itinerary.controller');
const mongoose = require('mongoose');

// Mock req and res
const req = {
  body: {
    destination: "Paris",
    days: 1,
    budget: "mid",
    travel_type: "couple",
    interests: ["museums"]
  }
};

const res = {
  status: function(code) {
    console.log("STATUS:", code);
    return this;
  },
  json: function(data) {
    if (data.success) {
       console.log("SUCCESS", JSON.stringify(data.data.itinerary, null, 2));
    } else {
       console.error("FAILED:", data.message);
    }
  }
};

mongoose.connect(process.env.MONGO_URI).then(async () => {
   console.log("Connected to MongoDB.");
   await generateItinerary(req, res);
   mongoose.disconnect();
}).catch(console.error);
