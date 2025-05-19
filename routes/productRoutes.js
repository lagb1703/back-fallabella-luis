const express = require('express');
const router = express.Router();
const { 
    getProductByObjectId, 
    getAllProductsByObjectsId,
    getProductByCategoryId, 
    getProductsNumberByCategory,
    getAllMarcaByCategoryId,
    getCategoryNameByCategoryId,
    getMinPriceByCategoryId,
    getMaxPriceByCategoryId,
    saveProductsToCart,
    getCart,
    saveProductToCart,
    deleteProductToCart
} = require('../controllers/productsControler');

const {
    validatePayment,
    getInvoice
} = require('./../controllers/paymetsController');

router.get('/invoice', getInvoice);
router.get('/:id', getProductByObjectId);
router.post('/', getAllProductsByObjectsId);
router.get('/number/:id', getProductsNumberByCategory);
router.get('/minPrice/:id', getMinPriceByCategoryId);
router.get('/maxPrice/:id', getMaxPriceByCategoryId);
router.post('/category/:id', getProductByCategoryId);
router.get('/categoryName/:id', getCategoryNameByCategoryId);
router.get('/tradeMark/:id', getAllMarcaByCategoryId);
router.get('/cart/:id', getCart);
router.post('/cart/:id', saveProductToCart);
router.delete('/cart/:id', deleteProductToCart);
router.post('/confirmacion', validatePayment);

module.exports = router;