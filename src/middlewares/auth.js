require("dotenv").config();
const jwt = require("jsonwebtoken");
const VARIABLES = require("../config");

const isAuthenticated = (allowedRoles = []) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    try {
      if (!authHeader) {
        return res.status(401).json({
          status: 401,
          success: false,
          message: "Unauthorized",
        });
      }
      const token = authHeader.split(" ")[1];

      jwt.verify(token, VARIABLES.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
          return res.status(403).json({
            status: 403,
            success: false,
            message: "Forbidden Access",
          });
        }

        if (!allowedRoles.some((role) => role === decoded.role)) {
          return res.status(403).json({
            status: 403,
            success: false,
            message: "Forbidden Access - Insufficient Permissions",
          });
        }

        req.user = decoded;
        next();
      });
    } catch (err) {
      res.status(401).json({
        status: 401,
        success: false,
        message: err.message,
      });
    }
  };
};

const isAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  try {
    if (!authHeader) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Unauthorized",
      });
    }
    const token = authHeader.split(" ")[1];

    jwt.verify(token, VARIABLES.ACCESS_TOKEN_SECRET, function (err, decoded) {
      if (err) {
        return res.status(403).json({
          status: 401,
          success: false,
          message: "Forbidden Access",
        });
      }
      req.user = decoded;
      next();
    });
  } catch (err) {
    res.status(401).json({
      status: 401,
      success: false,
      message: err.message,
    });
  }
};

const isAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  try {
    if (!authHeader) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Unauthorized",
      });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, VARIABLES.ACCESS_TOKEN_SECRET, function (err, decoded) {
      if (err) {
        return res.status(403).json({
          status: 401,
          success: false,
          message: "Forbidden Access",
        });
      }
      if (decoded.role === "Admin") {
        req.user = decoded;
        next();
      } else {
        return res.status(403).json({
          status: 401,
          success: false,
          message: "Forbidden Access",
        });
      }
    });
  } catch (err) {
    res.status(401).json({
      status: 401,
      success: false,
      message: err.message,
    });
  }
};

const isSetUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  try {
    const token = authHeader.split(" ")[1];
    if (token) {
      jwt.verify(token, VARIABLES.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (decoded?._id) {
          req.user = decoded;
        } else {
          req.user = null;
        }
      });
    }
    next();
  } catch (err) {
    res.status(401).json({
      status: 401,
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  isAuth,
  isAdmin,
  isSetUser,
  isAuthenticated,
};
