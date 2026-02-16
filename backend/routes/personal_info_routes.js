// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/personal_info_controllers');

// Route for creating or updating a user profile (Create/Update)
router.post('/profile', userController.createOrUpdateProfile);

// Route for uploading a profile picture
router.post('/upload', userController.upload, userController.uploadProfilePicture);

// Route for fetching a user profile by email (Read)
router.get('/profile/email/:email', userController.getProfileByEmail);

// --- NEW: Route for deleting a user profile (Delete) ---
router.delete('/profile/email/:email', userController.deleteProfileByEmail);

module.exports = router;