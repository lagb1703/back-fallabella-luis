const express = require('express');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Usar las rutas de autenticación
app.use('/auth', authRoutes);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

