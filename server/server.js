require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cron = require("node-cron");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Routes initialization
const userRoutes = require("./routes/userRoutes");

// Sockets initialization

const staffSockets = {};
const userSockets = {};
const guestSockets = {};

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  req.io = io;
  req.staffSockets = staffSockets;
  req.userSockets = userSockets;
  req.guestSockets = guestSockets;
  console.log(req.path, req.method);
  next();
});

app.use("/api/user", userRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to database");
    server.listen(process.env.PORT, () => {
      console.log("Listening to", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
