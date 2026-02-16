// models/Profile.js
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  profilePicture: {
    type: String,
    default: null
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say'],
    default: null
  },
  dateOfBirth: {
    type: Date,
    default: null
  },
  location: {
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true
    },
    zipCode: {
      type: String,
      trim: true,
      default: null
    },
    timeZone: {
      type: String,
      default: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  },
  contact: {
    mobile: {
      type: String,
      trim: true,
      default: null
    },
    preferredContact: {
      type: String,
      enum: ['Email', 'Chat', 'Call', 'Video Call'],
      default: 'Email'
    }
  },
  skills: {
    skillsToTeach: [{
      name: {
        type: String,
        required: true
      },
      level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Expert'],
        required: true
      }
    }],
    skillsToLearn: [{
      type: String,
      required: true
    }]
  },
  communicationLanguage: {
    type: String,
    required: true,
    default: 'English'
  },
  bio: {
    type: String,
    maxlength: 1000,
    default: ''
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalSessions: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for search functionality
profileSchema.index({ 'skills.skillsToTeach.name': 1 });
profileSchema.index({ 'skills.skillsToLearn': 1 });
profileSchema.index({ 'location.city': 1, 'location.state': 1, 'location.country': 1 });

module.exports = mongoose.model('Profile', profileSchema);