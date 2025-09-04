const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure 'uploads' folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage settings
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Unique filename with timestamp
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter to allow only images
const imageFileFilter = (req, file, cb) => {
  // Accept only image mimetypes
  const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];
  const allowedExtensions = [".jpeg", ".jpg", ".png"];

  const mimetypeValid = allowedMimeTypes.includes(file.mimetype);
  const extValid = allowedExtensions.includes(
    path.extname(file.originalname).toLowerCase()
  );

  if (mimetypeValid && extValid) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpeg, jpg, png)"));
  }
};

// Multer upload instance
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: imageFileFilter,
});

module.exports = upload;