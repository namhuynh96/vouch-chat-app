const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");

const Message = require("./models/message");

const roomRoutes = require("./routes/room");

const app = express();
const server = http.createServer(app);

const isDevEnv = process.env.NODE_ENV === "dev";

if (isDevEnv) {
  app.use(cors());
}

app.use("/room", roomRoutes);

const socketIo = require("socket.io")(
  server,
  isDevEnv && {
    cors: {
      origin: "*",
    },
  }
);

socketIo.on("connection", (socket) => {
  console.log("New client connected" + socket.id);

  socket.emit("getId", socket.id);

  socket.on("clientMessage", async (data) => {
    const { roomId, userId, message } = data;
    const newMessage = new Message({
      message,
      roomOwner: roomId,
      userOwner: userId,
    });
    await newMessage.save();
    socketIo.emit(`serverMessageForRoom ${roomId}`, {
      message: newMessage._doc,
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected " + socket.id);
  });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.12o3g.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    server.listen(3500, () => {
      console.log("Server running on port 3500");
    });
  })
  .catch((err) => console.log(err));
