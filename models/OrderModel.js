const mongoose = require("mongoose");

const orderSchemaRules = {
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductModel",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered"],
    default: "pending",
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
};

const orderSchema = new mongoose.Schema(orderSchemaRules);

const OrderModel = mongoose.model("OrderModel", orderSchema);

module.exports = OrderModel;
