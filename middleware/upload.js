const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname.toLowerCase());
    cb(null, Date.now() + ext);
  },
});

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      console.log("MIME:", file.mimetype);
      cb(null, true);
    } else {
      console.log("Only JPG & PNG file supported");
      cb(null, false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 2, // 2MB limit
  },
});

module.exports = upload;
