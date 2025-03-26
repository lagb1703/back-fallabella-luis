const express = require('express');
const router = express.Router();
const { login } = require('../controllers/loginController'); // Importa el controlador de login
const { register } = require('../controllers/registerController'); // Importa el controlador de registro
const { register_TEST } = require('../controllers/registerController_TEST'); // Importa el controlador de registro
const { requestChangePassword, validationPin } = require('../controllers/recuperation_passwordController'); // Cambia la importación


router.post('/login', login);

router.post('/register', register);

router.post('/register_TEST', register_TEST);

router.post('/change_password', requestChangePassword);

router.post('/validation', validationPin);

module.exports = router;