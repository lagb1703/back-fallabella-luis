const express = require('express');
const router = express.Router();
const { 
    getProductByObjectId, 
    getProductByCategoryId, 
    getProductsNumberByCategory,
    getAllMarcaByCategoryId,
    getCategoryNameByCategoryId,
    getMinPriceByCategoryId,
    getMaxPriceByCategoryId
} = require('../controllers/productsControler');

router.get('/:id', getProductByObjectId);
router.get('/number/:id', getProductsNumberByCategory);
router.get('/minPrice/:id', getMinPriceByCategoryId);
router.get('/maxPrice/:id', getMaxPriceByCategoryId);
router.post('/category/:id', getProductByCategoryId);
router.get('/categoryName/:id', getCategoryNameByCategoryId);
router.get('/tradeMark/:id', getAllMarcaByCategoryId);

module.exports = router;