const express = require('express');
const cors = require('cors');
const testRoutes = require('./routes/test.routes');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const itineraryRoutes = require('./routes/itinerary.routes');



const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/test', testRoutes);

app.use('/api/auth', authRoutes);

app.use('/api/user', userRoutes);

app.use('/api/itinerary', itineraryRoutes);



app.get('/', (req, res) => {
  res.send('API is running');
});

module.exports = app;



