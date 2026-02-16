// controllers/userController.js
const User = require('../model/personal_info_model');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// --- Multer configuration for file uploads (unchanged) ---
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
exports.upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
}).single('profilePicture');

// --- API controller functions ---

// Function to fetch a user profile by email (Read)
exports.getProfileByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Function to create or update a user profile (Create/Update)
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const { email, ...updateData } = req.body;
    
    // findOneAndUpdate with upsert: true will create or update the document
    const user = await User.findOneAndUpdate(
      { email: updateData.contact.email },
      updateData,
      { new: true, upsert: true, runValidators: true }
    );
    
    res.status(200).json({
      message: 'Profile saved successfully',
      user
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).map(key => error.errors[key].message);
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Function to handle the profile picture upload (unchanged)
exports.uploadProfilePicture = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const filePath = `/uploads/${req.file.filename}`;
  res.status(200).json({ message: 'File uploaded successfully', filePath });
};

// --- NEW: Function to delete a user profile (Delete) ---
exports.deleteProfileByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOneAndDelete({ email });

    if (!user) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};