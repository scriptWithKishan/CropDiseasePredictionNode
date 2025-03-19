const axios = require("axios");
const FormData = require("form-data");

const predictTheDisease = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const formData = new FormData();
    formData.append("image", req.file.buffer, req.file.originalname);

    const response = await axios.post(
      "http://localhost:5000/predict",
      formData,
      { headers: formData.getHeaders() }
    );

    res.json(response.data);
  } catch (err) {
    console.error("Axios error:", err.message);
    if (err.response) {
      console.error("Flask API responded with:", err.response.data);
      res.status(500).json({ error: err.response.data });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = { predictTheDisease };
