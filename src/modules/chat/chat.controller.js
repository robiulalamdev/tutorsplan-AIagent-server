const { generateAIMessage } = require("../../config/openai");
const Chat = require("./chat.model");

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
        prerequisites: {
          name: null,
          age: null,
          address: null,
          bio: null,
        },
        messages: [
          {
            message: req.body.message,
            role: "User",
          },
        ],
      });
      const savedChat = await newChat.save();
      return res.status(201).json({
        success: true,
        type: "prerequisite",
        name: "name",
        message: "What is your name?",
        chatId: savedChat._id,
      });
    } else {
      if (req.body.name) {
        chat.prerequisites.name = req.body.name;
        await updateChat(chatId, chat);
      } else if (req.body.age) {
        chat.prerequisites.age = req.body.age;
        await updateChat(chatId, chat);
      } else if (req.body.address) {
        chat.prerequisites.address = req.body.address;
        await updateChat(chatId, chat);
      } else if (req.body.bio) {
        chat.prerequisites.bio = req.body.bio;
        await updateChat(chatId, chat);
      }

      let havePrerequisiteRes = null;
      if (chat.prerequisites.name === null) {
        havePrerequisiteRes = {
          success: true,
          type: "prerequisite",
          name: "name",
          message: "What is your name?",
        };
      } else if (chat.prerequisites.age === null) {
        havePrerequisiteRes = {
          success: true,
          type: "prerequisite",
          name: "age",
          message: "How old are you?",
        };
      } else if (chat.prerequisites.address === null) {
        havePrerequisiteRes = {
          success: true,
          type: "prerequisite",
          name: "address",
          message: "Where do you live?",
        };
      } else if (chat.prerequisites.bio === null) {
        havePrerequisiteRes = {
          success: true,
          type: "prerequisite",
          name: "bio",
          message: "Tell me about yourself",
        };
      }
      if (havePrerequisiteRes) {
        return res.status(201).json(havePrerequisiteRes);
      } else {
        let userInfo = `
        Name: ${chat.prerequisites.name}
        Age: ${chat.prerequisites.age}
        Address: ${chat.prerequisites.address}
        Bio: ${chat.prerequisites.bio}
        `;

        chat.messages.push({
          message: req.body.message,
          role: "User",
        });
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
            role: "Assistant",
          });
          await updateChat(chatId, chat);
          return res.status(200).json({
            success: true,
            message: "Message generated successfully",
            data: aiRes.message,
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

module.exports = {
  makeConversation,
  getChats,
};
