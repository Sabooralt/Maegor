const { v4: uuidv4 } = require("uuid");
const Message = require("../models/messagesModel");

const generateMessageId = async () => {
  let messageId;
  let isUnique = false;

  while (!isUnique) {
    messageId = uuidv4();
    const existingRoomId = await Message.findOne({ messageId });
    if (!existingRoomId) {
      isUnique = true;
    }
  }

  return messageId;
};

module.exports = generateMessageId;
