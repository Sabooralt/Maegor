const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Message = require("./models/messagesModel");

// Connect to your MongoDB database
mongoose.connect(
  "mongodb+srv://saboor:saboor@maegor.6sevis6.mongodb.net/?retryWrites=true&w=majority&appName=Maegor/maegor",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to the database");
});

const createMockMessages = async (roomId, numMessages = 20) => {
  const messages = [];

  for (let i = 0; i < numMessages; i++) {
    const message = new Message({
      roomId: roomId,
      userId: faker.datatype.uuid(),
      senderId: "66993a51378bc9cd861f61d6",
      messageId: faker.datatype.uuid(),
      message: faker.lorem.sentence(),
      createdAt: faker.date.recent(),
    });
    messages.push(message);
  }

  try {
    await Message.insertMany(messages);
    console.log(`${numMessages} messages inserted successfully`);
  } catch (error) {
    console.error("Error inserting messages:", error);
  } finally {
    mongoose.connection.close();
  }
};

createMockMessages("20d362fa-619d-4c3e-befb-d59f7b9da98d");
