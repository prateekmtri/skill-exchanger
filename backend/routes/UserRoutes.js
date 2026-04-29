const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserControllers');
const upload = require('../middleware/uplpad');
const { protect } = require('../middleware/auth');

// ✅ Public Routes
router.post('/users/login', userController.loginUser);

// ✅ PEHLE profile route (specific routes hamesha :id se upar hone chahiye)
router.post('/users/profile', upload.single('profilePicture'), userController.createProfile);

router.get('/users', userController.getAllUsers);

// ✅ BAAD ME :id route (generic routes hamesha neeche)
router.get('/users/:id', userController.getProfile);

// ✅ Protected Routes
router.patch('/users/:id', protect, upload.single('profilePicture'), userController.updateProfile);
router.delete('/users/:id', protect, userController.deleteProfile);

// TEMP ROUTE: Apne aap ko admin banane ke liye (baad mein hata dena)
// POST /api/make-me-admin
router.post('/make-me-admin', async (req, res) => {
  try {
    const jwt = require('jsonwebtoken');
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ status: 'fail', message: 'Login required' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const User = require('../model/User');
    const user = await User.findByIdAndUpdate(decoded.id, { isAdmin: true }, { new: true });
    res.json({ status: 'success', message: 'You are now admin!', isAdmin: user.isAdmin });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Make any user an admin by email (admin only)
// POST /api/make-user-admin
router.post('/make-user-admin', async (req, res) => {
  try {
    const jwt = require('jsonwebtoken');
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ status: 'fail', message: 'Login required' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const User = require('../model/User');
    const admin = await User.findById(decoded.id);
    if (!admin || !admin.isAdmin) {
      return res.status(403).json({ status: 'fail', message: 'Admin access required' });
    }
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ status: 'fail', message: 'Email required' });
    }
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { isAdmin: true },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }
    res.json({ status: 'success', message: `${email} is now admin!`, user: { email: user.email, isAdmin: user.isAdmin } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Remove admin access from any user (admin only)
// POST /api/remove-admin
router.post('/remove-admin', async (req, res) => {
  try {
    const jwt = require('jsonwebtoken');
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ status: 'fail', message: 'Login required' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const User = require('../model/User');
    const admin = await User.findById(decoded.id);
    if (!admin || !admin.isAdmin) {
      return res.status(403).json({ status: 'fail', message: 'Admin access required' });
    }
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ status: 'fail', message: 'Email required' });
    }
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { isAdmin: false },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }
    res.json({ status: 'success', message: `${email} is no longer admin`, user: { email: user.email, isAdmin: user.isAdmin } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;