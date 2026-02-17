const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserControllers');
const upload = require('../middleware/uplpad');
const { protect } = require('../middleware/auth');

// Public Routes (Bina login ke chalne waale)
router.post('/users/login', userController.loginUser);
router.post('/users/profile', upload.single('profilePicture'), userController.createProfile);
router.post('/users/verify-otp', userController.verifyOtp); // ✅ OTP Verify Route
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getProfile);

// Protected Routes (Login karna zaroori hai)
router.patch('/users/:id', protect, upload.single('profilePicture'), userController.updateProfile);
router.delete('/users/:id', protect, userController.deleteProfile);

module.exports = router;