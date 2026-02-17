// socket/socket.js (Supercharged Version)

const Message = require('../model/message');
const User = require('../model/User');
const { sendMessageNotification } = require('../controllers/chatController'); // ✅ Import

const userSocketMap = new Map(); // key: userId, value: socket.id

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    
    socket.on('addUser', (userId) => {
      userSocketMap.set(userId, socket.id);
      io.emit('get_online_users', Array.from(userSocketMap.keys()));
    });

    socket.on('private_message', async ({ senderId, receiverId, content }) => {
      try {
        const receiverSocketId = userSocketMap.get(receiverId);
        const messageStatus = receiverSocketId ? 'delivered' : 'sent';

        const newMessage = new Message({ senderId, receiverId, content, status: messageStatus });
        await newMessage.save();
        
        // Agar receiver offline hai, toh database mein unread count badhayein
        if (!receiverSocketId) {
            await User.findByIdAndUpdate(receiverId, {
                $inc: { [`unreadMessages.${senderId}`]: 1 }
            });

            // ✅ Sirf yeh 1 line add ki hai — offline hai to email bhejo
            await sendMessageNotification({ senderId, receiverId, content });
        }

        if (receiverSocketId) {
          io.to(receiverSocketId).emit('new_message', newMessage);
        }
        
        socket.emit('new_message', newMessage);

      } catch (error) {
        console.error('Error handling private message:', error);
      }
    });

    socket.on('mark_messages_as_seen', async ({ senderId, receiverId }) => {
        try {
            await Message.updateMany(
                { senderId: receiverId, receiverId: senderId, status: { $ne: 'seen' } },
                { $set: { status: 'seen' } }
            );

            // Database se unread count ko clear karein
            await User.findByIdAndUpdate(senderId, {
                $unset: { [`unreadMessages.${receiverId}`]: 1 }
            });

            const senderSocketId = userSocketMap.get(senderId);
            if(senderSocketId) {
                io.to(senderSocketId).emit('messages_seen', { conversationPartner: receiverId });
            }
        } catch (error) {
            console.error('Error marking messages as seen:', error);
        }
    });

    socket.on('disconnect', () => {
      for (let [userId, sockId] of userSocketMap.entries()) {
        if (sockId === socket.id) {
          userSocketMap.delete(userId);
          break;
        }
      }
      io.emit('get_online_users', Array.from(userSocketMap.keys()));
    });
  });
};

module.exports = socketHandler;