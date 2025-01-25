const { model, Schema } = require("mongoose");

const chatSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  prerequisites: {
    type: Object,
    name: { type: String, default: null },
    age: { type: Number, default: null },
    address: { type: String, default: null },
    bio: { type: String, default: null },
    required: true,
  },
  messages: [
    {
      _id: false,
      message: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        enum: ["User", "Assistant"],
        required: true,
      },
    },
  ],
});

const Chat = model("Chat", chatSchema);

module.exports = Chat;
