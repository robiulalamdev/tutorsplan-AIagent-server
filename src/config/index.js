const path = require("path");
require("dotenv").config({ path: path.join(process.cwd(), ".env") });

const VARIABLES = {
  // Server
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  SERVER_URL: process.env.SERVER_URL,

  // Database
  DATABASE_URL: process.env.DATABASE_URL,

  // Secret
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,

  // Client
  CLIENT_URL: process.env.CLIENT_URL,

  // Mail User
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASS: process.env.MAIL_PASS,

  CLOUD_NAME: process.env.CLOUD_NAME,
  API_KEY: process.env.API_KEY,
  API_SECRET: process.env.API_SECRET,

  // open ai api key
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
};

module.exports = VARIABLES;
