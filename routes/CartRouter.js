const express = require("express");

/******  Initializing Router  ******/
const CartRouter = express.Router();

/******  Middleware  ******/
const protectedRouteMiddleware = require("../middleware/protectedRoute");

/******  Cart Controller  ******/
const { addProductToCartHandler } = require("../controllers/CartController");

/******  Cart Routes  ******/
CartRouter.post("/add", protectedRouteMiddleware, addProductToCartHandler);

module.exports = CartRouter;
