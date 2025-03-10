const client = require('./conectbd');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');

console.log('Hola')

client.connect()
  .then(() => console.log('Conectado a la base de datos'))
  .catch(err => console.error('Error de conexión', err));
  
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  
  // Ruta para registrar un usuario
  app.post('/registro', async (req, res) => {
    const { correo, nombres,  apellidos, identificador, celular, contrasena, tipoDocumento_id,} = req.body;
  
    //Cambiar tipo de dato 
    if (!correo || !nombres || !apellidos ||  !identificador || !celular || !contrasena || !tipoDocumento_id) {
      return res.status(400).json({ success: false, message: 'Rellene todos los campos' });
    }
  
    try {
      const saltRounds = 10;
      const hash = await bcrypt.hash(contrasena, saltRounds);
      
      const query = 'INSERT INTO usuarios."TB_Usuarios" (correo, nombres,  apellidos, identificador, celular, contrasena, "tipoDocumento_id") VALUES ($1, $2, $3, $4, $5, $6, $7)';
      await client.query(query, [correo, nombres, apellidos , identificador, celular, hash, parseInt(tipoDocumento_id)]);
  
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