const { v4: uuidv4 } = require("uuid");
const Room = require("../models/roomModel");

const generateRoomId = async () => {
  let roomId;
  let isUnique = false;

  while (!isUnique) {
    roomId = uuidv4();
    const existingRoomId = await Room.findOne({ roomId });
    if (!existingRoomId) {
      isUnique = true;
    }
  }

  return roomId;
};

module.exports = generateRoomId;
