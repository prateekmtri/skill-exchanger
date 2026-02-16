
const Message = require('../model/message');

exports.getMessages = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { senderId: loggedInUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: loggedInUserId },
      ],
    }).sort({ createdAt: 1 }); // Purane se naye messages

    res.status(200).json({ status: 'success', data: { messages } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};