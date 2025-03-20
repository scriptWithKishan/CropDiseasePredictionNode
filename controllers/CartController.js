const CartModel = require("../models/CartModel");

/******  Add Product to Cart Handler  ******/
const addProductToCartHandler = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    let cart = await CartModel.findOne({ user: userId });

    if (!cart) {
      cart = new CartModel({
        user: userId,
        items: [{ product: productId, quantity }],
        total: quantity,
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

      cart.total = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to add product to cart." });
  }
};

module.exports = { addProductToCartHandler };
