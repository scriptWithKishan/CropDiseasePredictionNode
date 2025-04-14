const express = require("express");

/******  Initializing Router  ******/
const CartRouter = express.Router();

/******  Middleware  ******/
const protectedRouteMiddleware = require("../middleware/protectedRoute");

/******  Cart Controller  ******/
const {
  addProductToCartHandler,
  getCartDetailsHandler,
} = require("../controllers/CartController");

/******  Cart Routes  ******/
CartRouter.post("/add", protectedRouteMiddleware, addProductToCartHandler);
CartRouter.get("/:userId", protectedRouteMiddleware, getCartDetailsHandler);

module.exports = CartRouter;
