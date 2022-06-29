const { Schema, model } = require("mongoose");

const userShema = new Schema({
  username: {
    type: String,
    required: true,
  },
  isOnline: {
    type: Boolean,
    required: true,
  },
  roomOwner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Room",
  },
});

const User = model("User", userShema);

module.exports = User;
