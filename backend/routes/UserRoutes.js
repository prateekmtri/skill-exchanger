const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserControllers');
const upload = require('../middleware/uplpad');
const { protect } = require('../middleware/auth');

// ✅ Public Routes
router.post('/users/login', userController.loginUser);

// ✅ PEHLE profile route (specific routes hamesha :id se upar hone chahiye)
router.post('/users/profile', upload.single('profilePicture'), userController.createProfile);
router.post('/users/verify-otp', userController.verifyOtp);

router.get('/users', userController.getAllUsers);

// ✅ BAAD ME :id route (generic routes hamesha neeche)
router.get('/users/:id', userController.getProfile);

// ✅ Protected Routes
router.patch('/users/:id', protect, upload.single('profilePicture'), userController.updateProfile);
router.delete('/users/:id', protect, userController.deleteProfile);

module.exports = router;