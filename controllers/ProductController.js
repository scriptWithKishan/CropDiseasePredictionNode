/******  Product Model  ******/
const ProductModel = require("../models/ProductModel");

const { getAllFactory, getByIdFactory } = require("../utility/crudFactory");

/******  Product Handlers  ******/
const getAllProducts = getAllFactory(ProductModel);
const getProductById = getByIdFactory(ProductModel);

const createProduct = async function (req, res) {
  try {
    const { name, description, price, discount, category, stock } = req.body;

    const newProduct = new ProductModel({
      name,
      description,
      price,
      discount,
      category,
      stock,
    });

    if (req.files) {
      let path = "";
      req.files.forEach(function (files, index, arr) {
        path = path + files.path + ",";
      });
      path = path.substring(0, path.lastIndexOf(","));
      newProduct.images = path;
    }

    await newProduct.save();

    res.status(201).json({
      status: "success",
      message: "Product Created Successfully",
      newProduct,
    });
  } catch (err) {
    res.status(500).json({
      status: "failure",
      message: "Couldn't Create the Product",
      error: err.message,
    });
  }
};

module.exports = { getAllProducts, getProductById, createProduct };
