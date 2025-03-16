const client = require('../config/conectbd');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
  const { correo, nombres, apellidos, identificador, celular, contrasena, tipoDocumento_id } = req.body;

  // Validar campos obligatorios
  if (!correo || !nombres || !apellidos || !identificador || !celular || !contrasena || !tipoDocumento_id) {
    return res.status(400).json({ success: false, message: 'Rellene todos los campos' });
  }

  try {
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
    await client.query(query, [correo, nombres, apellidos, identificador, celular, hash, parseInt(tipoDocumento_id)]);

    // Respuesta exitosa
    res.status(201).json({ success: true, message: 'Usuario registrado con éxito' });
  } catch (err) {
    console.error('Error al registrar el usuario:', err);
    res.status(500).json({ success: false, message: 'Error al registrar el usuario' });
  }
};

module.exports = {
  register,
};