const express = require("express");
const cors = require("cors");
const { routers } = require("./routes");
const app = express();
const path = require("path");
const http = require("http");
const requestIp = require("request-ip");

app.use(requestIp.mw());
app.use(cors());
app.use(express.json({ limit: "500mb" }));
app.use(
  express.urlencoded({ limit: "500mb", extended: true, parameterLimit: 500000 })
);

const Server = http.createServer(app);

app.use("/api/v1", routers);
app.use("/api/v1/uploads", express.static(path.join(__dirname, "../")));

module.exports = { app, Server };
