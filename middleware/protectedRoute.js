const dotenv = require("dotenv");

const jwt = require("jsonwebtoken");

dotenv.config();
const { JWT_SECRET } = process.env;

const promisify = require("util").promisify;
const promisifiedJWTVerify = promisify(jwt.verify);

const protectedRouteMiddleware = async function (req, res, next) {
  try {
    if (!req.headers.authorization) {
      throw new Error("Unauthorized");
    }

    let jwtToken = req.headers.authorization.split(" ")[1];
    if (!jwtToken) {
      throw new Error("Unauthorized");
    }

    let decryptedToken = await promisifiedJWTVerify(jwtToken, JWT_SECRET);
    if (!decryptedToken) {
      throw new Error("Unauthorized");
    }

    let userId = decryptedToken.id;
    req.userId = userId;
    next();
  } catch (err) {
    res.status(401).json({
      status: "error",
      message: "Unauthorized",
    });
  }
};

module.exports = protectedRouteMiddleware;
