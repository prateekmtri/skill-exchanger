const User = require('../model/User');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

// ---------- safe helper ----------
const safeJSON = (str, fallback = null) => {
 try {
   return JSON.parse(str);
 } catch {
   return fallback;
 }
};

// ---------- JWT Token Generator ----------
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// ---------- LOGIN ----------
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ status: 'fail', message: 'Please provide email and password' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ status: 'fail', message: 'Invalid email or password' });
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ status: 'fail', message: 'Invalid email or password' });
    }
    const token = generateToken(user._id);
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: { id: user._id, fullName: user.fullName, email: user.email, profilePicture: user.profilePicture }
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// ---------- CREATE ----------
exports.createProfile = async (req, res) => {
  try {
    const userData = {
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      gender: req.body.gender,
      dateOfBirth: req.body.dateOfBirth,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      zipCode: req.body.zipCode,
      timeZone: req.body.timeZone,
      skillsToTeach: safeJSON(req.body.skillsToTeach, []),
      skillsToLearn: safeJSON(req.body.skillsToLearn, []),
      mobile: req.body.mobile,
      preferredContact: req.body.preferredContact,
      bio: req.body.bio,
      profilePicture: req.file ? req.file.path : null,
    };
    const user = new User(userData);
    await user.save();
    res.status(201).json({
      status: 'success',
      data: {
        user: { id: user._id, fullName: user.fullName, email: user.email, profilePicture: user.profilePicture },
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ status: 'fail', message: 'Email already exists' });
    }
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ---------- READ ----------
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }
    res.status(200).json({ status: 'success', data: { user } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// ---------- UPDATE ----------
exports.updateProfile = async (req, res) => {
  try {
    const updates = {
      fullName: req.body.fullName,
      email: req.body.email,
      gender: req.body.gender,
      dateOfBirth: req.body.dateOfBirth,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      zipCode: req.body.zipCode,
      timeZone: req.body.timeZone,
      skillsToTeach: safeJSON(req.body.skillsToTeach, []),
      skillsToLearn: safeJSON(req.body.skillsToLearn, []),
      mobile: req.body.mobile,
      preferredContact: req.body.preferredContact,
      bio: req.body.bio,
    };
    if (req.file) updates.profilePicture = req.file.path;
    delete updates.password;
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select('-password');
    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }
    res.status(200).json({ status: 'success', data: { user } });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ---------- DELETE (FINAL CORRECTED VERSION) ----------
exports.deleteProfile = async (req, res) => {
  try {
    // Step 1: Check karein ki user apna hi account delete kar raha hai ya nahi
    // req.user humein 'protect' middleware se mil raha hai
    if (req.params.id !== req.user.id) {
      return res.status(403).json({ status: 'fail', message: 'You are not authorized to perform this action' });
    }

    // Step 2: Frontend se password lein
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ status: 'fail', message: 'Password is required to delete account' });
    }

    // Step 3: Password verify karein
    // REMOVED: Faltu ki database call hata di gayi hai
    // const user = await User.findById(req.user.id);
    
    // MODIFIED: Ab hum seedha req.user ka istemal kar rahe hain
    const isPasswordCorrect = await req.user.comparePassword(password);
    
    if (!isPasswordCorrect) {
      return res.status(401).json({ status: 'fail', message: 'Incorrect password' });
    }

    // Step 4: Sab kuch theek hone par, user ko delete karein
    await User.findByIdAndDelete(req.user.id);
    
    // Success response bhejein
    res.status(204).json({ status: 'success', data: null });

  } catch (error) {
    console.error("Delete profile error:", error); // Behtar debugging ke liye error log
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

// ---------- LIST ----------
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select('-password');
    
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: { users },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};