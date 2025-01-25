const express = require("express");
const {
  makeConversation,
  getChats,
  updatePrerequisite,
} = require("./chat.controller");
const router = express.Router();

router.post("/conversation", makeConversation);
router.get("/", getChats);
router.patch("/prerequisite/:chatId", updatePrerequisite);

module.exports = {
  chatRoutes: router,
};
