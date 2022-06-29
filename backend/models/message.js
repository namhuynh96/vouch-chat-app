const { Schema, model } = require("mongoose");

const messageShema = new Schema({
  message: {
    type: String,
    required: true,
  },
  userOwner: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  roomOwner: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

const Message = model("Message", messageShema);

module.exports = Message;
