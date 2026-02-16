// routes/chatRoutes.js

const express = require('express');
const router = express.Router();

// Controller ko import karein
const chatController = require('../controllers/chatController');

// Middleware ko import karein
// Yahan hum object destructuring { protect } ka use kar rahe hain
// Iska matlab hai ki auth.js file 'exports.protect' ka use kar rahi hai, jo ki sahi hai.
const { protect } = require('../middleware/auth');

// Route to get messages between logged-in user and another user
// Yahan hum pehle 'protect' middleware chalayenge, fir 'getMessages' controller
// Dono ka function hona zaroori hai.
router.get('/chat/:userId', protect, chatController.getMessages);

module.exports = router;