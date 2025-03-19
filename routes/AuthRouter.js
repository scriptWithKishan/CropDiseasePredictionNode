const express = require("express");

/******  Initializing Routers  ******/
const AuthRouter = express.Router();

const {
  createUserHandler,
  loginUserHandler,
} = require("../controllers/AuthControllers");

/******  Auth Routers  ******/
AuthRouter.post("/signup", createUserHandler);
AuthRouter.post("/login", loginUserHandler);

module.exports = AuthRouter;
