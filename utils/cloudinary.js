const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");
const path = require("path");
require('dotenv').config();

// Configure Cloudinary with environment variables
const config = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dqe1dci5x',
  api_key: process.env.CLOUDINARY_API_KEY || '596686335616678',
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
};

// Verify required configuration
if (!config.api_secret) {
  console.error('CLOUDINARY_API_SECRET is not set in environment variables');
  process.exit(1);
}

try {
  cloudinary.config(config);
  console.log('Cloudinary configured successfully');
} catch (error) {
  console.error('Error configuring Cloudinary:', error.message);
  process.exit(1);
}

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      throw new Error('No file path provided');
    }

    // Check if file exists
    if (!fs.existsSync(localFilePath)) {
      throw new Error(`File not found: ${localFilePath}`);
    }

    console.log(`Uploading file to Cloudinary: ${localFilePath}`);
    
    // Upload the file to Cloudinary with minimal options first
    const uploadOptions = {
      resource_type: 'auto'
    };
    
    // Only add folder if it's specified in environment variables
    if (process.env.CLOUDINARY_FOLDER) {
      uploadOptions.folder = process.env.CLOUDINARY_FOLDER;
    }
    
    console.log('Uploading with options:', uploadOptions);
    const response = await cloudinary.uploader.upload(localFilePath, uploadOptions);

    console.log('File uploaded to Cloudinary:', response.secure_url);
    
    // Delete the local file after successful upload
    try {
      fs.unlinkSync(localFilePath);
      console.log('Local file deleted:', localFilePath);
    } catch (unlinkError) {
      console.error('Error deleting local file:', unlinkError);
    }

    return response;
  } catch (error) {
    console.error('Error in uploadOnCloudinary:', error.message);
    
    // Try to delete the local file in case of error
    if (localFilePath && fs.existsSync(localFilePath)) {
      try {
        fs.unlinkSync(localFilePath);
        console.log('Local file deleted after error:', localFilePath);
      } catch (unlinkError) {
        console.error('Error deleting local file after error:', unlinkError);
      }
    }
    
    throw error; // Re-throw the error to be handled by the caller
  }
};

module.exports = { uploadOnCloudinary };