const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserControllers');
const upload = require('../middleware/uplpad'); // Maan lete hain ki aapka upload middleware yahan hai
const { protect } = require('../middleware/auth'); // protect middleware ko import karein

// Public Routes (Bina login ke chalne waale)
router.post('/users/login', userController.loginUser);
router.post('/users/profile', upload.single('profilePicture'), userController.createProfile);
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getProfile);

// Protected Routes (Login karna zaroori hai)
router.patch('/users/:id', protect, upload.single('profilePicture'), userController.updateProfile);
router.delete('/users/:id', protect, userController.deleteProfile);

module.exports = router;