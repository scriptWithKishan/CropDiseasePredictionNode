const mongoose = require("mongoose");

const validCategories = [
  "Fertilizers",
  "Pesticides",
  "Seeds",
  "Plant Growth Regulators",
  "Soil Conditioners",
  "Gardening Tools",
  "Packaging & Storing",
];

const productSchemaRules = {
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    validate: {
      validator: function (value) {
        return value > 0;
      },
      message: "Price must be greater than 0",
    },
  },
  discount: {
    type: Number,
    required: [true, "Discount is required"],
    validate: {
      validator: function (value) {
        return value >= 0 && value < 100;
      },
      message: "Discount must be between 0 and 100",
    },
  },
  category: {
    type: String,
    enum: validCategories,
    required: [true, "Categories is required"],
  },
  images: {
    type: String,
    required: [true, "Image is required"],
  },
  ratingsAverage: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        required: [true, "User is required"],
      },
      rating: {
        type: Number,
        required: [true, "Rating is required"],
        validate: {
          validator: function (value) {
            return value >= 1 && value <= 5;
          },
          message: "Rating must be between 1 and 5",
        },
      },
      comment: {
        type: String,
        required: [true, "Comment is required"],
      },
      createdAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  stock: {
    type: Number,
    required: [true, "Stock is required"],
    validate: {
      validator: function (value) {
        return value >= 0;
      },
      message: "Stock must be greater than or equal to 0",
    },
  },
};

const productSchema = new mongoose.Schema(productSchemaRules);

productSchema.index({ name: "text", description: "text" });

productSchema.pre("save", function (next) {
  if (this.reviews.length > 0) {
    const totalRatings = this.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    this.ratingsAverage = totalRatings / this.reviews.length;
  } else {
    this.ratingsAverage = 0;
  }
  next();
});

const ProductModel = mongoose.model("ProductModel", productSchema);

module.exports = ProductModel;
