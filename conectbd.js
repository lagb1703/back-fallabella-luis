// conectbd.js
const { Client } = require('pg');

// Configuración de la conexión a la base de datos
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'falabella',
  password: 'Labsoft',
  port: 5432,
});

// Exportar el cliente directamente
module.exports = client;


