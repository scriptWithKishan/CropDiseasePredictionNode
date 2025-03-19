const express = require("express");

const protectedRouteMiddleware = require("../middleware/protectedRoute");
const { createReview } = require("../controllers/ReviewController");

/******  Initializing Router  ******/
const ReviewRouter = express.Router();

/******  Review Router  ******/
ReviewRouter.patch("/:dataId", protectedRouteMiddleware, createReview);

module.exports = ReviewRouter;
