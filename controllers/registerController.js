const pool = require('../config/conectbd');
const bcrypt = require('bcrypt');
const axios = require('axios'); // Para hacer solicitudes HTTP a la API de ZeroBounce

// Función para verificar un correo electrónico usando ZeroBounce
async function verificarCorreo(correo) {
    const apiKey = 'tu_api_key_de_zerobounce'; // Reemplaza con tu API Key de ZeroBounce
    const url = `https://api.zerobounce.net/v2/validate?api_key=${apiKey}&email=${correo}`;

    try {
        const response = await axios.get(url);
        const resultado = response.data;

        // ZeroBounce devuelve un campo "status" que indica si el correo es válido
        if (resultado.status === 'valid') {
            return true; // El correo es válido
        } else {
            return false; // El correo no es válido
        }
    } catch (error) {
        console.error('Error al verificar el correo:', error);
        return false;
    }
}

const register = async (req, res) => {
    const { correo, nombres, apellidos, identificador, celular, contrasena, tipoDocumento_id } = req.body;

    // Validar campos obligatorios
    if (!correo || !nombres || !apellidos || !identificador || !celular || !contrasena || !tipoDocumento_id) {
        return res.status(400).json({ success: false, message: 'Rellene todos los campos' });
    }

<<<<<<< HEAD
  // Función para validar la contraseña
  const validarContrasena = (password) => {
    // Mínimo 8 caracteres
    if (password.length < 8) {
      return { valido: false, mensaje: 'La contraseña debe tener al menos 8 caracteres.' };
    }

    // Al menos 1 número
    if (!/\d/.test(password)) {
      return { valido: false, mensaje: 'La contraseña debe contener al menos un número.' };
    }

    // Al menos 1 mayúscula
    if (!/[A-Z]/.test(password)) {
      return { valido: false, mensaje: 'La contraseña debe contener al menos una letra mayúscula.' };
    }

    // Al menos 1 minúscula
    if (!/[a-z]/.test(password)) {
      return { valido: false, mensaje: 'La contraseña debe contener al menos una letra minúscula.' };
    }

    // Sin espacios
    if (/\s/.test(password)) {
      return { valido: false, mensaje: 'La contraseña no debe contener espacios.' };
    }

    // Caracteres no permitidos: \¡¿"ºª·`´çñÑ
    if (/[\\¡¿"ºª·`´çñÑ]/.test(password)) {
      return { valido: false, mensaje: 'La contraseña contiene caracteres no permitidos.' };
    }

    return { valido: true };
  };

  // Validar la contraseña
  const validacion = validarContrasena(contrasena);
  if (!validacion.valido) {
    return res.status(400).json({ success: false, message: validacion.mensaje });
  }

  try {
    // Hashear la contraseña
    const saltRounds = 10;
    const hash = await bcrypt.hash(contrasena, saltRounds);
=======
    try {
        // Verificar si el correo es válido usando ZeroBounce
        const correoValido = await verificarCorreo(correo);
        if (!correoValido) {
            return res.status(400).json({ success: false, message: 'El correo electrónico no es válido' });
        }
>>>>>>> f2ef4be844b5b83cc3842c5cc02a2f47b7ece24f

        // Verificar si el correo ya está registrado en la base de datos
        const existeCorreo = await pool.query(
            'SELECT * FROM usuarios."TB_Usuarios" WHERE correo = $1',
            [correo]
        );

        if (existeCorreo.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'El correo electrónico ya está registrado' });
        }

        // Hashear la contraseña
        const saltRounds = 10;
        const hash = await bcrypt.hash(contrasena, saltRounds);

        // Insertar el usuario en la base de datos
        const query = `
            INSERT INTO usuarios."TB_Usuarios" 
                (correo, nombres, apellidos, identificador, celular, contrasena, "tipoDocumento_id") 
            VALUES 
                ($1, $2, $3, $4, $5, $6, $7)
        `;
        await pool.query(query, [correo, nombres, apellidos, identificador, celular, hash, parseInt(tipoDocumento_id)]);

        // Respuesta exitosa
        res.status(201).json({ success: true, message: 'Usuario registrado con éxito' });
    } catch (err) {
        console.error('Error al registrar el usuario:', err);
        res.status(500).json({ success: false, message: 'Error al registrar el usuario' });
    }
};

module.exports = {
    register
};