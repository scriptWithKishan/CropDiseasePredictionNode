const Cart = require("../models/CartModel");
const Product = require("../models/ProductModel");
const Order = require("../models/OrderModel");
const { getAllFactory, getByIdFactory } = require("../utility/crudFactory");

const createOrderController = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId)
      return res.status(400).json({ message: "User ID is required." });

    const cart = await Cart.findOne({ user: userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty!" });
    }

    // Extract product IDs from cart
    const productIds = cart.items.map((item) => item.product.toString());

    // Fetch current product details including discount
    const products = await Product.find({ _id: { $in: productIds } });

    // Create a map for quick price and discount lookup
    const productMap = {};
    products.forEach((product) => {
      productMap[product._id.toString()] = {
        price: product.price,
        discount: product.discount, // discount field is now included
      };
    });

    // Prepare order items with fresh price info and applying discount
    const orderItems = cart.items.map((item) => {
      const { price, discount } = productMap[item.product.toString()];
      if (price === undefined)
        throw new Error(`Price not found for product ID: ${item.product}`);

      // Calculate the discounted price
      const discountedPrice = price * (1 - discount / 100);

      return {
        product: item.product,
        quantity: item.quantity,
        price: discountedPrice * item.quantity, // Apply discount to price
      };
    });

    // Calculate total amount dynamically
    const totalAmount = orderItems.reduce((sum, item) => sum + item.price, 0);

    // Create new order
    const newOrder = new Order({
      user: userId,
      items: orderItems,
      total: totalAmount,
    });

    // Update stock quantities with atomic conditional updates
    for (const item of cart.items) {
      try {
        // 1. First check current stock
        const product = await Product.findById(item.product);
        if (!product) {
          throw new Error(`Product ${item.product} not found`);
        }

        // 2. Verify stock availability
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${item.product}`);
        }

        // 3. Atomic update with condition
        const result = await Product.findOneAndUpdate(
          {
            _id: item.product,
            stock: { $gte: item.quantity }, // Only update if stock is sufficient
          },
          { $inc: { stock: -item.quantity } },
          { new: true }
        );

        if (!result) {
          throw new Error(`Stock update failed for product ${item.product}`);
        }
      } catch (error) {
        // If any product update fails, delete the order and abort
        await Order.deleteOne({ _id: newOrder._id });
        return res.status(400).json({
          message: "Order failed: " + error.message,
        });
      }
    }

    // Only save the order if all stock updates succeeded
    await newOrder.save();

    // Clear the cart
    cart.items = [];
    cart.total = 0;
    await cart.save();

    return res.status(201).json({
      message: "Order placed successfully!",
      order: newOrder,
    });
  } catch (error) {
    console.error("Order placement failed:", error);
    return res.status(500).json({ message: "Server error. Try again later." });
  }
};

const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const orders = await Order.find({ user: userId }).populate("items.product");

    if (!orders.length) {
      return res
        .status(404)
        .json({ message: "No orders found for this user." });
    }

    return res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Server error. Try again later." });
  }
};

module.exports = {
  createOrderController,
  getOrdersByUserId,
};
