require("dotenv").config();
const jwt = require("jsonwebtoken");
const VARIABLES = require("../config");

const generateToken = async (user) => {
  return jwt.sign(user, VARIABLES.ACCESS_TOKEN_SECRET, {
    expiresIn: "7days",
  });
};

const generateVerifyToken = async (data) => {
  return jwt.sign(data, VARIABLES.ACCESS_TOKEN_SECRET, {
    expiresIn: "48h",
  });
};

const decodeToken = async (token) => {
  const result = await jwt.verify(
    token,
    VARIABLES.ACCESS_TOKEN_SECRET,
    function (err, decoded) {
      return { err, decoded };
    }
  );

  if (!!result?.err) {
    return {
      status: 403,
      success: false,
      message: "unauthorized",
      data: null,
    };
  } else {
    return {
      status: 200,
      success: true,
      message: "Token Decode Success",
      data: result?.decoded,
    };
  }
};

module.exports = {
  generateToken,
  generateVerifyToken,
  decodeToken,
};
