const CartModel = require("../models/CartModel");
const ProductModel = require("../models/ProductModel");

/******  Add Product to Cart Handler  ******/
const addProductToCartHandler = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    let cart = await CartModel.findOne({ user: userId });

    // Fetch Product Price
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ status: "failure", message: "Product not found" });
    }

    if (!cart) {
      // Create a new cart and set total directly
      cart = new CartModel({
        user: userId,
        items: [{ product: productId, quantity }],
        total:
          (product.price - (product.discount / 100) * product.price) * quantity, // Set initial total once
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      // Recalculate total only if cart already exists
      cart.total = await calculateTotal(cart.items);
    }

    await cart.save();
    res.status(200).json({ status: "success", cart });
  } catch (err) {
    res.status(500).json({
      status: "failure",
      message: "Failed to add product to cart.",
      error: err.message,
    });
  }
};

const getCartDetailsHandler = async (req, res) => {
  const { userId } = req.params;
  try {
    const cart = await CartModel.findOne({ user: userId });

    if (!cart) {
      return res
        .status(404)
        .json({ status: "failure", message: "Cart not found" });
    } else {
      res.status(200).json({ status: "success", message: "Cart found", cart });
    }
  } catch (err) {
    res.status(500).json({
      status: "failure",
      message: "Failed to get cart details.",
      error: err.message,
    });
  }
};

// **Helper Function to Calculate Total Price**
const calculateTotal = async (items) => {
  let total = 0;
  for (const item of items) {
    const product = await ProductModel.findById(item.product);
    total +=
      (product.price - (product.discount / 100) * product.price) *
      item.quantity;
  }
  return total;
};

module.exports = { addProductToCartHandler, getCartDetailsHandler };
