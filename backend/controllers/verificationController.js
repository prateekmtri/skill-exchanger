const SkillVerification = require('../model/SkillVerification');
const User = require('../model/User');

exports.uploadVerificationVideo = async (req, res) => {
  try {
    const { skillName } = req.body;
    const userId = req.user._id;

    if (!skillName) {
      return res.status(400).json({ status: 'fail', message: 'Skill name is required' });
    }

    if (!req.file) {
      return res.status(400).json({ status: 'fail', message: 'Video file is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    const hasSkill = user.skillsToTeach?.some(s => s.name.toLowerCase() === skillName.toLowerCase());
    if (!hasSkill) {
      return res.status(400).json({ 
        status: 'fail', 
        message: 'You must have this skill in your skillsToTeach list' 
      });
    }

    const verification = new SkillVerification({
      userId,
      skillName,
      videoUrl: req.file.path,
      videoPublicId: req.file.filename
    });

    await verification.save();

    user.verificationStatus = 'pending';
    await user.save();

    res.status(201).json({
      status: 'success',
      message: 'Video submitted! Your verification is under review.'
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getPendingVerifications = async (req, res) => {
  try {
    const verifications = await SkillVerification.find({ status: 'pending' })
      .populate('userId', 'fullName email profilePicture skillsToTeach')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      status: 'success',
      results: verifications.length,
      data: { verifications }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getAllVerifications = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && ['pending', 'verified', 'rejected'].includes(status) 
      ? { status } 
      : {};

    const verifications = await SkillVerification.find(filter)
      .populate('userId', 'fullName email profilePicture skillsToTeach')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      status: 'success',
      results: verifications.length,
      data: { verifications }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.approveVerification = async (req, res) => {
  try {
    const { id } = req.params;

    const verification = await SkillVerification.findById(id);
    if (!verification) {
      return res.status(404).json({ status: 'fail', message: 'Verification not found' });
    }

    if (verification.status !== 'pending') {
      return res.status(400).json({ status: 'fail', message: 'Verification already reviewed' });
    }

    verification.status = 'verified';
    verification.reviewedAt = Date.now();
    await verification.save();

    await User.findByIdAndUpdate(verification.userId, {
      verificationStatus: 'verified',
      verifiedSkill: verification.skillName
    });

    res.status(200).json({
      status: 'success',
      message: 'Verification approved'
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.rejectVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNote } = req.body;

    const verification = await SkillVerification.findById(id);
    if (!verification) {
      return res.status(404).json({ status: 'fail', message: 'Verification not found' });
    }

    if (verification.status !== 'pending') {
      return res.status(400).json({ status: 'fail', message: 'Verification already reviewed' });
    }

    verification.status = 'rejected';
    verification.adminNote = adminNote || null;
    verification.reviewedAt = Date.now();
    await verification.save();

    await User.findByIdAndUpdate(verification.userId, {
      verificationStatus: 'unverified'
    });

    res.status(200).json({
      status: 'success',
      message: 'Verification rejected'
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getUserVerificationStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select('verificationStatus verifiedSkill');
    
    const latestVerification = await SkillVerification.findOne({ userId })
      .sort({ submittedAt: -1 });

    res.status(200).json({
      status: 'success',
      data: {
        verificationStatus: user.verificationStatus,
        verifiedSkill: user.verifiedSkill,
        latestVerification: latestVerification ? {
          skillName: latestVerification.skillName,
          status: latestVerification.status,
          adminNote: latestVerification.adminNote,
          submittedAt: latestVerification.submittedAt,
          reviewedAt: latestVerification.reviewedAt
        } : null
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};