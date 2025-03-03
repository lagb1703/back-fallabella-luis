const client = require('./conectbd');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

client.connect()
  .then(() => console.log('Conectado a la base de datos'))
  .catch(err => console.error('Error de conexión', err));

  const app = express();
  app.use(bodyParser.json());
  
  // Ruta para registrar un usuario
  app.post('/register', async (req, res) => {
    const { email, contrasena } = req.body;
  
    if (!email || !contrasena) {
      return res.status(400).json({ success: false, message: 'Email y contraseña son requeridos' });
    }
  
    try {
      const saltRounds = 10;
      const hash = await bcrypt.hash(contrasena, saltRounds);
  
      const query = 'INSERT INTO falabella.usuario (email, contrasena) VALUES ($1, $2)';
      await client.query(query, [email, hash]);
  
      res.status(201).json({ success: true, message: 'Usuario registrado con éxito' });
    } catch (err) {
      console.error('Error al registrar el usuario:', err);
      res.status(500).json({ success: false, message: 'Error al registrar el usuario' });
    }
  });
  
  // Iniciar el servidor
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });