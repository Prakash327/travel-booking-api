const express = require('express');
const router = express.Router();

const { bookTravel, getBookTravel } = require('../controllers/book.controllers.js');

router.route('/').get(getBookTravel)
router.route('/').post(bookTravel);

module.exports = router;