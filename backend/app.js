// server.js

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
require('dotenv').config();

// Naye imports http aur socket.io ke liye
const http = require('http');
const { Server } = require("socket.io");

// Apne route files ko import karein
const userRoutes = require('./routes/UserRoutes');
const chatRoutes = require('./routes/chatRoute'); // Nayi route file chat ke liye

// Hamare naye socket handler ko import karein
const initializeSocket = require('./socket/socket');

const app = express();

// Connect to MongoDB
connectDB();

// CORS middleware
// NOTE: Is CORS config ko thoda aur flexible banaya hai, Authorization header allow karne ke liye.
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://skill-exchanger.vercel.app"
  ],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));



// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api', userRoutes);
app.use('/api', chatRoutes); // Nayi chat route ko register karein

// Basic test route
app.get('/', (req, res) => {
  res.send('Skill Exchanger API is up and running!');
});

// Error handler (last middleware)
app.use((error, req, res, next) => {
  console.error('Error:', error.stack);
  res.status(error.statusCode || 500).json({
    message: error.message || 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

const PORT = process.env.PORT || 5000;

// --- YAHAN SE BADE CHANGES HAIN ---

// 1. Express app se ek http server banayein
const server = http.createServer(app);

// 2. Socket.io ko uss http server ke saath naye CORS options ke saath initialize karein
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://skill-exchanger.vercel.app"
    ],
    methods: ["GET", "POST"]
  }
});


// 3. Hamare socket.js waale logic ko 'io' instance ke saath activate karein
initializeSocket(io);

// 4. app.listen() ki jagah server.listen() ka istemal karein
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('API server aur Chat server dono taiyaar hain!');
});