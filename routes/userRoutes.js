const express = require('express');
const { changeBasicInformation } = require('./../controllers/userController');

const router = express.Router();

router.patch('/:id', changeBasicInformation);

module.exports = router;