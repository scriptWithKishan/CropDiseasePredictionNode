const mongoose = require("mongoose");

const cartSchemaRules = {
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
        default: 1,
      },
    },
  ],
  total: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
};

const cartSchema = new mongoose.Schema(cartSchemaRules);

const CartModel = mongoose.model("CartModel", cartSchema);

module.exports = CartModel;
