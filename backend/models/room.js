const { Schema, model } = require("mongoose");

const roomShema = new Schema({
  roomName: {
    type: String,
    required: true,
  },
});

const Room = model("Room", roomShema);

module.exports = Room;
