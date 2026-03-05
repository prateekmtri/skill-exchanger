const User = require('../model/User');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { Resend } = require('resend');

// ✅ Resend Client (SMTP nahi, HTTP API use karta hai — Render pe perfectly kaam karta hai)
const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ Temporary OTP Store (account save nahi hoga jab tak OTP verify na ho)
// { email: { otp, otpExpiry, formData } }
const otpStore = {};

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

// ---------- OTP Generator ----------
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

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

    // ✅ Email verified check
    if (!user.isVerified) {
      return res.status(401).json({ status: 'fail', message: 'Please verify your email first' });
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

// ✅ ---------- CREATE (Sirf OTP bhejo, account save mat karo) ----------
exports.createProfile = async (req, res) => {
  try {
    const email = req.body.email;

    // Email pehle se exist karta hai?
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: 'fail', message: 'Email already exists' });
    }

    // Form data temporarily store karo
    const formData = {
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

    // ✅ OTP Generate karo
    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 min (timestamp format)

    // ✅ Memory me temporarily store karo (database me nahi)
    otpStore[email] = { otp, otpExpiry, formData };

    // ✅ Resend se OTP Email bhejo
    try {
      const { error: emailError } = await resend.emails.send({
        from: 'Skill Exchanger <onboarding@resend.dev>', // ⚠️ Apna domain add karne ke baad yahan change karo: noreply@yourdomain.com
        to: email,
        subject: 'Your OTP Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto; padding: 30px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #4F46E5;">Hello ${formData.fullName}! 👋</h2>
            <p style="color: #555;">Your OTP verification code is:</p>
            <div style="text-align: center; margin: 20px 0;">
              <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #4F46E5;">${otp}</span>
            </div>
            <p style="color: #555;">This code is valid for <b>10 minutes</b>.</p>
            <p style="color: #999; font-size: 12px;">If you did not create an account, please ignore this email.</p>
          </div>
        `,
      });

      // ✅ Resend ne error diya to catch karo
      if (emailError) {
        throw emailError;
      }

      // ✅ Email successfully chala gaya
      return res.status(200).json({
        status: 'success',
        message: 'OTP sent to your email. Please verify to complete registration.',
      });

    } catch (emailErr) {
      console.error("Resend Email Error:", emailErr);
      delete otpStore[email]; // Memory se data hata do kyunki OTP fail ho gaya
      return res.status(500).json({ status: 'error', message: 'Could not send OTP email. Please check RESEND_API_KEY in environment variables.' });
    }

  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ✅ ---------- VERIFY OTP (OTP sahi ho to account save karo) ----------
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ status: 'fail', message: 'Email and OTP are required' });
    }

    // ✅ OTP store me check karo
    const stored = otpStore[email];

    if (!stored) {
      return res.status(400).json({ status: 'fail', message: 'OTP expired or not found. Please signup again.' });
    }

    // ✅ OTP match check
    if (stored.otp !== otp) {
      return res.status(400).json({ status: 'fail', message: 'Invalid OTP. Please try again.' });
    }

    // ✅ Expiry check
    if (Date.now() > stored.otpExpiry) {
      delete otpStore[email]; // Clean up
      return res.status(400).json({ status: 'fail', message: 'OTP expired. Please signup again.' });
    }

    // ✅ OTP sahi hai — AB account save karo
    const userData = {
      ...stored.formData,
      isVerified: true,
    };

    const user = new User(userData);
    await user.save();

    // ✅ OTP store se hata do
    delete otpStore[email];

    const token = generateToken(user._id);

    res.status(201).json({
      status: 'success',
      message: 'Email verified! Account created successfully.',
      token,
      data: {
        user: { id: user._id, fullName: user.fullName, email: user.email, profilePicture: user.profilePicture }
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
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

// ---------- DELETE ----------
exports.deleteProfile = async (req, res) => {
  try {
    if (req.params.id !== req.user.id) {
      return res.status(403).json({ status: 'fail', message: 'You are not authorized to perform this action' });
    }
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ status: 'fail', message: 'Password is required to delete account' });
    }
    const isPasswordCorrect = await req.user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ status: 'fail', message: 'Incorrect password' });
    }
    await User.findByIdAndDelete(req.user.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    console.error("Delete profile error:", error);
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