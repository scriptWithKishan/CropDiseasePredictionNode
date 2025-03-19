const express = require("express");

/******  Initializing Router  ******/
const UserRouter = express.Router();

/******  Middleware  ******/
const protectedRouteMiddleware = require("../middleware/protectedRoute");

/******  User Controller  ******/
const { getUserByIdHandler } = require("../controllers/UserController");

/******  User Router  ******/
UserRouter.get("/:dataId", protectedRouteMiddleware, getUserByIdHandler);

module.exports = UserRouter;
