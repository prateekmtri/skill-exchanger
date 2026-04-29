const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verificationController');
const { upload } = require('../config/cloudinary');
const { protect, isAdmin } = require('../middleware/auth');

router.post(
  '/verification/upload',
  protect,
  upload.single('video'),
  verificationController.uploadVerificationVideo
);

router.get(
  '/verification/pending',
  protect,
  isAdmin,
  verificationController.getPendingVerifications
);

router.get(
  '/verification/all',
  protect,
  isAdmin,
  verificationController.getAllVerifications
);

router.patch(
  '/verification/:id/approve',
  protect,
  isAdmin,
  verificationController.approveVerification
);

router.patch(
  '/verification/:id/reject',
  protect,
  isAdmin,
  verificationController.rejectVerification
);

router.get(
  '/verification/my-status',
  protect,
  verificationController.getUserVerificationStatus
);

module.exports = router;