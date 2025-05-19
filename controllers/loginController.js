const bcrypt = require('bcrypt');
const pool = require('../config/conectbd');

const login = async (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ success: false, message: 'correo y contraseña son requeridos' });
  }

  try {
    const query = 'SELECT usuario_id, contrasena, correo, nombres, apellidos, celular, identificador FROM usuarios."TB_Usuarios" WHERE correo = $1 ';
    const result = await pool.query(query, [correo]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    const usuario = result.rows[0];
    const contrasenaHash = usuario.contrasena;

    const esValida = await bcrypt.compare(contrasena, contrasenaHash);

    if (!esValida) {
      return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
    }
    res.status(200).json({
      success: true, message: 'Inicio de sesión exitoso', usuario: {
        usuario_id: usuario.usuario_id,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        identificador: usuario.identificador,
        celular: usuario.celular
      }
    });
  } catch (err) {
    console.error('Error al iniciar sesión:', err);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

module.exports = {
  login
};

