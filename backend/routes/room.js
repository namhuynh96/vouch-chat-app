const { Router } = require("express");

const Room = require("../models/room");
const User = require("../models/user");
const Message = require("../models/message");

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { roomName, username } = req.query;
    const room = await Room.findOne({ roomName });
    const user = await User.findOne({ username });

    if (!room) {
      const newRoom = new Room({ roomName });
      const newUser = new User({
        username,
        isOnline: false,
        roomOwner: newRoom._id,
      });

      await newRoom.save();
      await newUser.save();

      return res.status(201).send({
        message: "Room and user are created",
        data: { roomId: newRoom._id, userId: newUser._id },
      });
    }

    if (!user) {
      const newUser = new User({
        username,
        isOnline: false,
        roomOwner: room._id,
      });

      await newUser.save();

      return res.status(201).send({
        message: "User is created",
        data: { roomId: room._id, userId: newUser._id },
      });
    }

    if (user.isOnline) {
      return res.status(400).send({ message: "User is currently in the room" });
    }

    return res
      .status(200)
      .send({ data: { roomId: room._id, userId: user._id } });
  } catch (error) {
    return res.status(500).send();
  }
});

router.get("/messages", async (req, res) => {
  try {
    const { roomId, userId } = req.query;
    const user = await User.findById(userId);
    user.isOnline = true;
    await user.save();
    const messages = await Message.find({ roomOwner: roomId }).populate(
      "userOwner"
    );

    return res.status(200).send({ data: { messages } });
  } catch (error) {
    return res.status(500).send();
  }
});

router.post("/exit", async (req, res) => {
  try {
    const { userId } = req.query;
    const user = await User.findById(userId);
    user.isOnline = false;
    await user.save();

    return res.status(200).send();
  } catch (error) {
    return res.status(500).send();
  }
});

module.exports = router;
