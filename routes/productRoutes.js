const express = require('express');
const router = express.Router();
const { getProductByObjectId, getProductByCategoryId } = require('../controllers/productsControler');

router.get('/:id', getProductByObjectId);
router.get('/category/:id', getProductByCategoryId);

module.exports = router;