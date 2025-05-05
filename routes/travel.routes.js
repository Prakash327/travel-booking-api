const express = require('express');
const router = express.Router();
const { getTravel, getAllTravel, createTravel, updateTravel, deleteTravel } = require('../controllers/travel.controllers.js');
const { upload } = require('../middleware/image.upload.js');

// Handle file upload errors
const handleUpload = (req, res, next) => {
    upload.single('image')(req, res, function (err) {
        if (err) {
            // Handle multer errors
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ error: 'File size too large. Maximum size is 5MB' });
            } else if (err.message === 'Only image files are allowed!') {
                return res.status(400).json({ error: err.message });
            }
            return res.status(400).json({ error: 'Error uploading file' });
        }
        next();
    });
};

router.route('/').get(getAllTravel);
router.route('/travel/:id').get(getTravel);
router.route('/create').post(handleUpload, createTravel);
router.route('/update/:id').put(updateTravel);
router.route('/delete/:id').delete(deleteTravel);

module.exports = router;