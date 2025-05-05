const express = require('express');
const router = express.Router();
const { getTravel, getAllTravel, createTravel, updateTravel, deleteTravel } = require('../controllers/travel.controllers.js');
const { upload, uploadToCloudinary } = require('../middleware/image.upload.js');

// Handle file upload errors and upload to Cloudinary
const handleUpload = (req, res, next) => {
    upload.single('image')(req, res, async function (err) {
        if (err) {
            // Handle multer errors
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ error: 'File size too large. Maximum size is 5MB' });
            } else if (err.message.includes('Only image files')) {
                return res.status(400).json({ error: 'Only image files (jpeg, jpg, png, gif) are allowed!' });
            }
            return res.status(400).json({ error: 'Error uploading file' });
        }
        next();
    });
};

// Apply both upload handling and Cloudinary upload
const processUpload = [
    handleUpload,
    uploadToCloudinary
];

router.route('/').get(getAllTravel);
router.route('/travel/:id').get(getTravel);
router.route('/create').post(processUpload, createTravel);
router.route('/update/:id').put(updateTravel);
router.route('/delete/:id').delete(deleteTravel);

module.exports = router;