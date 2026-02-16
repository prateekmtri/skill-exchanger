// models/Message.js

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  // --- YEH NAYA FIELD ADD KIYA GAYA HAI ---
  status: {
    type: String,
    enum: ['sent', 'delivered', 'seen'],
    default: 'sent'
  }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;