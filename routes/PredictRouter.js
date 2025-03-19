const express = require("express");
const multer = require("multer");
const { predictTheDisease } = require("../controllers/PredictController");

const PredictRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/******  Predict Routes  ******/
PredictRouter.post("/", upload.single("image"), predictTheDisease);

module.exports = PredictRouter;
