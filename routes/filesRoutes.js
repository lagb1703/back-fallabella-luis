const express = require('express');
const router = express.Router();
const { getImage } = require('../controllers/imagesController');

router.get('/images', getImage);
router.get('/images/:key', getImage);

module.exports = router;