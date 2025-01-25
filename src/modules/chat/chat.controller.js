const { generateAIMessage } = require("../../config/openai");
const Chat = require("./chat.model");

// Example usage
const prerequisites = [
  {
    id: 1,
    name: "name",
    label: "What is your first name, last name and Full Name?",
    type: "Input",
    fields: [
      {
        type: "text",
        required: true,
        label: "First Name",
        name: "first_name",
        placeholder: "Enter your first name",
      },
      {
        type: "text",
        required: true,
        label: "Last Name",
        name: "last_name",
        placeholder: "Enter your last name",
      },
      {
        type: "text",
        required: true,
        label: "Full Name",
        name: "full_name",
        placeholder: "Enter your full name",
      },
    ],
  },
  {
    id: 2,
    name: "platform_expectations",
    label: "What would you expect from Jobaar platform?",
    type: "Checkbox",
    options: [
      {
        value: "Find next job and may earn a signup bonus",
        label: "Find next job and may earn a signup bonus",
      },
      {
        value: "Refer friends, family, co-workers and earn referral fee",
        label: "Refer friends, family, co-workers and earn referral fee",
      },
    ],
  },
  {
    id: 3,
    name: "work_status",
    label: "Are you working now or looking for a new job opportunity?",
    type: "Radio",
    options: [
      {
        value: "Active Jobseeker, No work or project ends soon",
        label: "Active Jobseeker, No work or project ends soon",
      },
      {
        value: "Passive, Working now but looking for a better job opportunity",
        label: "Passive, Working now but looking for a better job opportunity",
      },
    ],
  },
];

function validateChatPrerequisites(prerequisites, chatPrerequisites) {
  const checkNestedFields = (fields, chatValue) => {
    if (typeof chatValue === "object" && !Array.isArray(chatValue)) {
      for (const key in fields) {
        if (
          fields[key].required &&
          (!chatValue[key] || chatValue[key].trim() === "")
        ) {
          return true; // Field is missing or empty
        }
      }
    }
    return false; // All fields are valid
  };

  // Iterate through prerequisites
  for (const item of prerequisites) {
    const chatValue = chatPrerequisites[item?.name];

    if (item.type === "Input") {
      const fieldsObject = item.fields.reduce((acc, field) => {
        acc[field.label.toLowerCase().replace(/\s+/g, "_")] = field;
        return acc;
      }, {});

      if (checkNestedFields(fieldsObject, chatValue)) {
        return item; // Return the full object if any field is invalid
      }
    } else if (item.type === "Checkbox") {
      // Handle `Checkbox` type (expects an array)
      if (!Array.isArray(chatValue) || chatValue.length === 0) {
        return item; // Return the full object if Checkbox is empty
      }
    } else if (item.type === "Radio") {
      // Handle `Radio` type (expects a single value)
      if (!chatValue || chatValue.trim() === "") {
        return item; // Return the full object if Radio is empty
      }
    }
  }

  return null; // All fields are valid
}

function formatChatPrerequisites(prerequisites, chatPrerequisites) {
  let result = "";

  prerequisites.forEach((item) => {
    const chatValue = chatPrerequisites[item?.name];

    if (item.type === "Input") {
      // Handle input type with nested fields
      if (typeof chatValue === "object" && !Array.isArray(chatValue)) {
        for (const key in chatValue) {
          if (chatValue[key]) {
            const fieldName = key.replace(/_/g, " "); // Replace underscores with spaces
            result += `${fieldName}: ${chatValue[key]}, `;
          }
        }
      }
    } else if (item.type === "Checkbox") {
      // Handle Checkbox type (array of selected options)
      if (Array.isArray(chatValue) && chatValue.length > 0) {
        result += `${item.label}: ${chatValue.join(", ")}, `;
      }
    } else if (item.type === "Radio") {
      // Handle Radio type (single value)
      if (chatValue) {
        result += `${item.label}: ${chatValue}, `;
      }
    }
  });

  return result.trim().replace(/, $/, ""); // Remove trailing comma and space
}

const updateChat = async (chatId, chat) => {
  const res = await Chat.updateOne(
    {
      _id: chatId,
    },
    {
      $set: chat,
    }
  );
  return res;
};

const makeConversation = async (req, res) => {
  try {
    const { chatId = "" } = req.body;

    let chat = null;
    if (chatId) {
      chat = await Chat.findById({ _id: chatId });
    }
    if (!chat) {
      const newChat = new Chat({
        name: req.body.message,
        messages: [
          {
            message: req.body.message,
            role: "User",
          },
        ],
      });
      const savedChat = await newChat.save();
      const formRes = {
        type: "Prerequisite",
        role: "Assistant",
        prerequisite: prerequisites[0],
        message: prerequisites[0].label,
      };

      chat.messages.push(formRes);
      await updateChat(chatId, chat);

      return res.status(201).json({
        success: true,
        type: "Prerequisite",
        data: {
          type: "Prerequisite",
          role: "Assistant",
          prerequisite: prerequisites[0],
          message: prerequisites[0].label,
        },
        chatId: savedChat._id,
      });
    } else {
      chat.messages.push({
        message: req.body.message,
        type: "Text",
        role: "User",
      });

      let havePrerequisiteRes = validateChatPrerequisites(
        prerequisites,
        chat.prerequisites
      );
      if (havePrerequisiteRes) {
        const formRes = {
          type: "Prerequisite",
          role: "Assistant",
          prerequisite: havePrerequisiteRes,
          message: havePrerequisiteRes.label,
        };

        chat.messages.push(formRes);
        await updateChat(chatId, chat);

        return res.status(201).json({
          success: true,
          type: "Prerequisite",
          data: formRes,
          chatId: chat._id,
        });
      } else {
        let userInfo = formatChatPrerequisites(
          prerequisites,
          chat.prerequisites
        );

        // generate messages as role and content property
        const messages = [];
        chat.messages.forEach((msg) => {
          messages.push({
            role: msg.role.toLowerCase(),
            content: msg.message,
          });
        });

        const aiRes = await generateAIMessage(messages, userInfo);
        if (aiRes.success) {
          chat.messages.push({
            message: aiRes.message,
            type: "Text",
            role: "Assistant",
          });
          await updateChat(chatId, chat);
          return res.status(200).json({
            success: true,
            message: "Message generated successfully",
            data: {
              type: "Text",
              role: "Assistant",
              message: aiRes.message,
            },
          });
        }
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getChats = async (req, res) => {
  try {
    const chats = await Chat.find().sort({ _id: -1 });
    return res.status(200).json({ success: true, data: chats });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updatePrerequisite = async (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = await Chat.findById({ _id: chatId });

    if (!chat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
    }

    let updatedPre = {
      ...chat.prerequisites,
    };
    if (req.body.prerequisite_name) {
      updatedPre[req.body.prerequisite_name] = req.body.prerequisite_value;
    }

    const result = await Chat.updateOne(
      {
        _id: chatId,
      },
      {
        $set: {
          prerequisites: updatedPre,
        },
      }
    );
    res
      .status(200)
      .json({ success: true, message: "Updated successfully", data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  makeConversation,
  getChats,
  updatePrerequisite,
};
