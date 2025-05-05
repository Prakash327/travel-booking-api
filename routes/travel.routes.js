const express = require('express');
const router = express.Router();

const { getTravel,getAllTravel,createTravel,updateTravel,deleteTravel }= require('../controllers/travel.controllers.js');
const { upload}  = require('../middleware/image.upload.js');

router.route('/').get(getAllTravel)
router.route('/travel/:id').get(getTravel);
router.route('/create').post(upload.single("image"),createTravel );
router.route('/update/:id').put(updateTravel);
router.route('/delete/:id').delete(deleteTravel);

module.exports = router;