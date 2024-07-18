const generateMessageId = require("../utils/generateMessageId");
const Message = require("../models/messagesModel");
const Room = require("../models/roomModel");

const saveMessage = async (req, res) => {
  const { roomId, senderId, message } = req.body;

  const room = await Room.findOne({ roomId });

  if (!room) {
    return res
      .status(404)
      .json({ error: "No room found or has been deleted!" });
  }

  const messageId = await generateMessageId();
  const newMessage = new Message({
    roomId,
    senderId,
    message: message,
    messageId,
  });
  await newMessage.save();

  if (Array.isArray(room.members)) {
    for (const member of room.members) {
      const studentIdString = member.toString();

      if (studentIdString === senderId) continue;
      if (
        req.userSockets[studentIdString] &&
        req.userSockets[studentIdString].socketId
      ) {
        const socketId = req.userSockets[studentIdString].socketId;
        req.io.to(socketId).emit("newMessage", newMessage);
      } else {
        console.log(`No socket found for student ID: ${studentIdString}`);
      }
    }
  }
  return res.status(201).json(newMessage);
};
const getMessages = async (req, res) => {
  const { roomId } = req.params;
  const { page = 0, limit = 20 } = req.query;

  try {
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const messages = await Message.find({ roomId })
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(parseInt(limit));

    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch messages",
      error: error.message,
    });
  }
};

module.exports = { saveMessage, getMessages };
