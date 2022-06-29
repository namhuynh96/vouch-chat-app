const { Schema, model } = require("mongoose");

const messageShema = new Schema({
  message: {
    type: String,
    required: true,
  },
  userOwner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  roomOwner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Room",
  },
});

const Message = model("Message", messageShema);

module.exports = Message;
