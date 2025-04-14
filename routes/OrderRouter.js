const express = require("express");

/******  Initializing Router  ******/
const OrderRouter = express.Router();

/******  Middleware  ******/
const protectedRouteMiddleware = require("../middleware/protectedRoute");

/******  Order Controller  ******/
const {
  createOrderController,
  getOrderController,
} = require("../controllers/OrderController");

OrderRouter.post("/", protectedRouteMiddleware, createOrderController);
OrderRouter.get("/", protectedRouteMiddleware, getOrderController);

module.exports = OrderRouter;
