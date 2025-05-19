const {config} = require('dotenv');
if(process.env.NODE_ENV !== 'production') {
  config();
}
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const filesRoutes = require('./routes/filesRoutes');
const infoRoutes = require('./routes/infoRouter');
const productRoutes = require('./routes/productRoutes');
const app = express();

// Middleware
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

// Configura CORS
app.use(cors());

// Usa las rutas de autenticación
app.use('/auth', authRoutes);

app.use('/files', filesRoutes);

app.use('/info', infoRoutes);

app.use('/products', productRoutes);

// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});