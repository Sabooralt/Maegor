const Message = require("../models/messagesModel");

const saveMessage = async (roomId, senderId, messageText) => {
  const message = new Message({
    roomId,
    senderId,
    message: messageText,
  });
  await message.save();
};

const getMessages = async (req, res) => {
  const { roomId } = req.params;
  let { limit, offset } = req.query;

  limit = parseInt(limit) || 10;
  offset = parseInt(offset) || 0;

  try {
    const messages = await Message.find({ roomId }).skip(offset).limit(limit);

    res.status(200).json(messages);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch messages", error: error.message });
  }
};

module.exports = { saveMessage,getMessages };
