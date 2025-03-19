const express = require("express");

/******  Initializing Router  ******/
const ProductRouter = express.Router();

const protectedRouteMiddleware = require("../middleware/protectedRoute");
const upload = require("../middleware/upload");

const {
  getAllProducts,
  getProductById,
  createProduct,
} = require("../controllers/ProductController");

/******  Product Router  ******/
ProductRouter.get("/", protectedRouteMiddleware, getAllProducts);
ProductRouter.get("/:dataId", protectedRouteMiddleware, getProductById);
ProductRouter.post(
  "/",
  protectedRouteMiddleware,
  upload.array("images[]"),
  createProduct
);

module.exports = ProductRouter;
