const express = require("express");
const { makeConversation, getChats } = require("./chat.controller");
const router = express.Router();

router.post("/conversation", makeConversation);
router.get("/", getChats);

module.exports = {
  chatRoutes: router,
};
