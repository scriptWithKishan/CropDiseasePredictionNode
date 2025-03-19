/******  Product Model  ******/
const ProductModel = require("../models/ProductModel");

/******  Review Handlers  ******/
const createReview = async function (req, res) {
  try {
    const { userId } = req;
    const { dataId } = req.params;
    const newReview = req.body;

    newReview.user = userId;

    const product = await ProductModel.findById(dataId);
    if (!product) {
      return res.status(404).json({
        status: "failure",
        message: `Product with ID ${dataId} not found`,
      });
    }

    // Add new review
    product.reviews.push(newReview);

    await product.save();

    res.status(200).json({
      status: "success",
      message: "Data updated successfully",
      product,
    });
  } catch (err) {
    res.status(500).json({
      status: "failure",
      message: "Error in updating data",
      error: err.message,
    });
  }
};

module.exports = { createReview };
 

