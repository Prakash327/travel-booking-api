const multer = require("multer");
const { v2: cloudinary } = require('cloudinary');
const { Readable } = require('stream');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer to handle file uploads in memory
const storage = multer.memoryStorage();

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(file.originalname.toLowerCase().match(/\.[0-9a-z]+$/i)[0]);
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, gif) are allowed!'), false);
  }
};

// Initialize multer with configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB file size limit
  }
});

// Middleware to handle Cloudinary upload
const uploadToCloudinary = (req, res, next) => {
  if (!req.file) return next();

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: process.env.CLOUDINARY_FOLDER || 'travel-booking',
      resource_type: 'auto'
    },
    (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        return next(error);
      }
      
      // Add the Cloudinary URL to the request object
      req.file.cloudinaryUrl = result.secure_url;
      req.file.public_id = result.public_id;
      next();
    }
  );

  // Convert buffer to stream
  const stream = new Readable();
  stream.push(req.file.buffer);
  stream.push(null);
  stream.pipe(uploadStream);
};

module.exports = {
  upload,
  uploadToCloudinary
};
