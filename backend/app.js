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
const chatRoutes = require('./routes/chatRoute');
const verificationRoutes = require('./routes/verificationRoutes'); 

// Hamare naye socket handler ko import karein
const initializeSocket = require('./socket/socket');

const app = express();

// Connect to MongoDB
connectDB();

// --- CORS CONFIGURATION UPDATED ---
// Humne yahan aapka Netlify URL aur '*' (for safety) add kar diya hai
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://skill-exchanger.vercel.app",
    "https://skill-exchanger.onrender.com",
    /\.netlify\.app$/ // Ye saari Netlify subdomains ko allow karega
  ],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api', userRoutes);
app.use('/api', chatRoutes);
app.use('/api', verificationRoutes); 

// Basic test route
app.get('/', (req, res) => {
  res.send('Skill Exchanger API is up and running!');
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Error:', error.stack);
  res.status(error.statusCode || 500).json({
    message: error.message || 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

const PORT = process.env.PORT || 5000;

// --- HTTP SERVER & SOCKET.IO ---

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Socket ke liye testing ke waqt '*' rakhna best hai
    methods: ["GET", "POST"]
  }
});

// Socket.js logic activate karein
initializeSocket(io);

// Server start
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('API server aur Chat server dono taiyaar hain!');
});