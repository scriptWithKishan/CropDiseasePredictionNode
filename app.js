const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

// Initializing express
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'uploads' folder
app.use("/uploads", express.static("uploads"));

// Initializing .env file
dotenv.config();
const { PORT, DB_USER, DB_PASSWORD } = process.env;

/******  Database Connection  ******/
const dbURL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.trpagex.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
mongoose
  .connect(dbURL)
  .then(function () {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log("Error in connecting to MongoDB", err));

/******  Routers  ******/
const PredictRouter = require("./routes/PredictRouter");
const AuthRouter = require("./routes/AuthRouter");
const ProductRouter = require("./routes/ProductRouter");
const ReviewRouter = require("./routes/ReviewRouter.js");
const UserRouter = require("./routes/UserRouter");

/******  Route  ******/
// Prediction Route
app.use("/api/predict", PredictRouter);
// Auth Route
app.use("/api/auth", AuthRouter);
// Product Route
app.use("/api/product", ProductRouter);
// Review Route
app.use("/api/review", ReviewRouter);
// User Route
app.use("/api/user", UserRouter);

app.use(function (req, res) {
  res.status(404).json({
    status: "failure",
    message: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
