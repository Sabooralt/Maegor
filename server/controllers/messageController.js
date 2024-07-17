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
  const newMessage = new Message({
    roomId,
    senderId,
    message: message,
  });
  await newMessage.save();

  if (Array.isArray(room.members)) {
    for (const member of room.members) {
      const studentIdString = member.toString();
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
  let { limit, offset } = req.query;

  limit = parseInt(limit) || 10;
  offset = parseInt(offset) || 0;

  try {
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const messages = await Message.find({ roomId })
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (messages.length === 0) {
      return res.status(404).json({ message: "No messages found" });
    }

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch messages",
      error: error.message,
    });
  }
};

module.exports = { saveMessage, getMessages };
