const express = require('express');
const router = express.Router();
const { login } = require('../controllers/loginController'); // Importa el controlador de login
const { register } = require('../controllers/registerController'); // Importa el controlador de registro
const { requestCambioContrasena, validarPin } = require('../controllers/recuperation_passwordController'); // Cambia la importación

// Ruta para iniciar sesión
router.post('/login', login);

// Ruta para registrar un nuevo usuario
router.post('/register', register);

// Ruta para solicitar un cambio de contraseña
router.post('/request_cambio_contrasena', requestCambioContrasena);

// Ruta para validar el PIN y cambiar la contraseña
router.post('/validar_pin', validarPin);

module.exports = router;