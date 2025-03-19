const mongoose = require("mongoose");

const UserSchemaRules = {
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    validate: {
      validator: function (value) {
        return value.length >= 8;
      },
      message: "Password must be at least 8 characters long",
    },
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
};

const userSchema = new mongoose.Schema(UserSchemaRules);

const UserModel = mongoose.model("UserModel", userSchema);

module.exports = UserModel;
