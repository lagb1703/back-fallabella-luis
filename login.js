const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const client = require('./conectbd');
const data = require('./data')
const cors = require('cors')

client.connect()
  .then(() => console.log('Conectado a la base de datos'))
  .catch(err => console.error('Error de conexión', err));

const app = express();
app.use(bodyParser.json());
app.use (cors())
app.get('/', (req, res) => {
  res.json(data)
})
// Ruta para iniciar sesión
app.post('/login', async (req, res) => {
  const { email, contrasena } = req.body;

  if (!email || !contrasena) {
    return res.status(400).json({ success: false, message: 'Email y contraseña son requeridos' });
  }

  try {
    const query = 'SELECT contrasena FROM falabella.usuario WHERE email = $1';
    const result = await client.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    const usuario = result.rows[0];
    const contrasenaHash = usuario.contrasena;

    const esValida = await bcrypt.compare(contrasena, contrasenaHash);

    if (!esValida) {
      return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
    }

    res.status(200).json({ success: true, message: 'Inicio de sesión exitoso', usuario });
  } catch (err) {
    console.error('Error al iniciar sesión:', err);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});