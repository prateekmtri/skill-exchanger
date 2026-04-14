const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const skillSchema = new mongoose.Schema({
  name: String,
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Intermediate'
  }
});

const userSchema = new mongoose.Schema({
  // Basic Info
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  profilePicture: {
    type: String,
    default: null
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say']
  },
  dateOfBirth: Date,

  // Location
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true
  },
  zipCode: String,
  timeZone: {
    type: String
  },

  // Skills
  skillsToTeach: [skillSchema],
  skillsToLearn: [{
    type: String
  }],

  // About
  mobile: String,
  preferredContact: {
    type: String,
    enum: ['Email', 'Chat', 'Call', 'Video Call'],
    default: 'Email'
  },
  bio: {
    type: String,
    minlength: [50, 'Bio must be at least 50 characters']
  },

  // Chat Features
  isChatEnabled: {
    type: Boolean,
    default: true,
  },
  unreadMessages: {
    type: Map,
    of: Number,
    default: {}
  },

  // ✅ Email Verification
  isVerified: {
    type: Boolean,
    default: true
  }

}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Password compare method for login
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;