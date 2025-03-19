const express = require('express');
const router = express.Router();
const { login } = require('../controllers/loginController'); // Importa el controlador de login
const { register } = require('../controllers/registerController'); // Importa el controlador de registro
const { requestChangePassword, validationPin } = require('../controllers/recuperation_passwordController'); // Cambia la importación

// Ruta para iniciar sesión
router.post('/login', login);

// Ruta para registrar un nuevo usuario
router.post('/register', register);

// Ruta para solicitar un cambio de contraseña
router.post('/change_password', requestChangePassword);

// Ruta para validar el PIN y cambiar la contraseña
router.post('/validation', validationPin);

module.exports = router;