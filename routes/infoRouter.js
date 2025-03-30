const express = require('express');
const router = express.Router();
const { footerController } = require('../controllers/footerController');
const { menuController, subMenuController } = require('../controllers/headerController');

router.get('/footer', footerController);
router.get('/header', menuController);
router.get('/header/:menu_id', subMenuController);

module.exports = router;