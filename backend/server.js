const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = require('./src/app');
const connectDB = require('./src/config/db');

// Connect to database
connectDB();

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});