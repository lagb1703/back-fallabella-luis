const {config} = require('dotenv');
if(process.env.NODE_ENV !== 'production') {
  config();
}
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const app = express();

// Middleware
app.use(bodyParser.json());

// Configura CORS
app.use(cors());

// Usa las rutas de autenticación
app.use('/auth', authRoutes);

// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});