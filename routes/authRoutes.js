const express = require('express');
const router = express.Router();
const { login } = require('../controllers/loginController'); // Importa el controlador de login
const { register } = require('../controllers/registerController'); // Importa el controlador de registro
const { register_TEST } = require('../controllers/registerController_TEST'); // Importa el controlador de registro
const { requestChangePassword, validationPin, newPassword } = require('../controllers/recuperation_passwordController'); // Cambia la importación


router.post('/login', login);

router.post('/register', register);

router.post('/register_TEST', register_TEST);

// Ruta para solicitar un cambio de contraseña
router.post('/verificate_email', requestChangePassword);

// Ruta para validar el PIN 
router.post('/validationPin', validationPin);

//Ruta para cambiar la contraseña
router.post('/change_password', newPassword);

module.exports = router;