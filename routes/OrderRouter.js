const express = require("express");

/******  Initializing Router  ******/
const OrderRouter = express.Router();

/******  Middleware  ******/
const protectedRouteMiddleware = require("../middleware/protectedRoute");

/******  Order Controller  ******/
const {
  createOrderController,
  getOrdersByUserId,
} = require("../controllers/OrderController");

OrderRouter.post("/", protectedRouteMiddleware, createOrderController);
OrderRouter.get("/:userId", protectedRouteMiddleware, getOrdersByUserId);

module.exports = OrderRouter;
