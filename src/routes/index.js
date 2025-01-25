const express = require("express");
const { chatRoutes } = require("../modules/chat/chat.route");

const router = express.Router();

const moduleRoutes = [
  {
    path: "/chat",
    route: chatRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
module.exports = { routers: router };
