const dotenv = require('dotenv');
dotenv.config();

const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

let server;

// ✅ Start server only after DB connects
const startServer = async () => {
  try {
    await connectDB();
    console.log(" Database connected");

    server = app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error(" Failed to start server:", err.message);
    process.exit(1); // only exit if startup fails
  }
};

startServer();


// 🔴 HANDLE UNCAUGHT EXCEPTIONS
process.on('uncaughtException', (err) => {
  console.error(' Uncaught Exception:', err.message);

  // graceful shutdown
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});


// 🔴 HANDLE PROMISE REJECTIONS
process.on('unhandledRejection', (err) => {
  console.error(' Unhandled Rejection:', err.message);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});


// 🟡 OPTIONAL: handle Ctrl+C shutdown
process.on('SIGINT', () => {
  console.log(' Shutting down server...');

  if (server) {
    server.close(() => {
      console.log(' Server closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});
