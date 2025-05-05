const multer = require("multer");
const fs = require("fs");
const path = require("path");

const tempDir = path.join(__dirname, "public", "temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "middleware/public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

module.exports.upload = multer({ storage });
