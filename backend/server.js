// //const dotenv = require('dotenv').config();

// // Load environment variables
// //dotenv.config();
// require('dotenv').config();
// const app = require('./src/app');
// const connectDB = require('./src/config/db');

// // Connect to database
// connectDB();

// // Define port
// const PORT = process.env.PORT || 5000;

// // Start server
// app.listen(PORT, () => {
//   console.log(` Server running on port ${PORT}`);
// });

// process.on('unhandledRejection', (err) => {
//   console.error(`Unhandled Rejection: ${err.message}`);
//   process.exit(1);
// });

// process.on('uncaughtException', (err) => {
//   console.error(`Uncaught Exception: ${err.message}`);
//   process.exit(1);
// });
require('dotenv').config();

const app = require('./src/app');

// 👇 IMPORTANT (with .js)
const connectDB = require('./src/config/db.js');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use (possibly by an older version of this app). Please kill the old process.`);
        process.exit(1);
      } else {
        console.error(`❌ Server error:`, error);
      }
    });

  } catch (error) {
    console.error("Server start failed:", error.message);
  }
};

startServer();