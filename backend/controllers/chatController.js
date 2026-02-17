const Message = require('../model/message');
const User = require('../model/User');
const nodemailer = require('nodemailer');

// ✅ Gmail Transporter (same jo OTP me use kiya tha)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// ✅ Online users track karne ke liye (socket.js se import kar sakte ho ya yahan use karo)
// Yeh set globally available hona chahiye — socket.js me bhi yahi use karo
let onlineUsers = new Set();

exports.setOnlineUsers = (users) => {
  onlineUsers = users;
};

// ---------- GET MESSAGES ----------
exports.getMessages = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { senderId: loggedInUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: loggedInUserId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({ status: 'success', data: { messages } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// ✅ ---------- SEND MESSAGE + EMAIL NOTIFICATION ----------
exports.sendMessageNotification = async ({ senderId, receiverId, content }) => {
  try {
    // ✅ Check karo receiver online hai ya nahi
    const isReceiverOnline = onlineUsers.has(receiverId);

    // ✅ Agar offline hai to email bhejo
    if (!isReceiverOnline) {
      const [sender, receiver] = await Promise.all([
        User.findById(senderId).select('fullName email'),
        User.findById(receiverId).select('fullName email'),
      ]);

      if (!sender || !receiver) return;

      await transporter.sendMail({
        from: `"Skill Exchanger" <${process.env.GMAIL_USER}>`,
        to: receiver.email,
        subject: `💬 New message from ${sender.fullName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto; padding: 30px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #4F46E5;">Hey ${receiver.fullName}! 👋</h2>
            <p style="color: #555;"><b>${sender.fullName}</b> has sent you a message:</p>
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p style="color: #374151; font-style: italic;">"${content.length > 100 ? content.substring(0, 100) + '...' : content}"</p>
            </div>
            <a href="https://skill-exchanger.netlify.app/pages/chat/${senderId}" 
               style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
              Reply Now →
            </a>
            <p style="color: #bbb; font-size: 11px; margin-top: 24px; text-align: center;">
              Developed by <b style="color: #888;">Prateek Mani Tripathi</b>
            </p>
          </div>
        `,
      });

      console.log(`✅ Email notification sent to ${receiver.email}`);
    }
  } catch (error) {
    console.error('Email notification error:', error.message);
  }
};