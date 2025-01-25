const { model, Schema } = require("mongoose");

const chatSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  prerequisites: {
    type: Object,
    name: {
      type: Object,
      first_name: String,
      last_name: String,
      full_name: String,
    },
    platform_expectations: {
      type: [String],
      required: false,
    },
    work_status: {
      type: String,
      required: false,
    },
    default: {
      name: {
        first_name: "",
        last_name: "",
        full_name: "",
      },
      platform_expectations: [],
      work_status: "",
    },
  },
  messages: [
    {
      _id: false,
      type: {
        type: String,
        enum: ["Prerequisite", "Text"],
        default: "Text",
      },
      prerequisite: {
        type: Object,
        required: false,
      },
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
