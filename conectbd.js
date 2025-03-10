// conectbd.js
const { Client } = require('pg');

// Configuración de la conexión a la base de datos
const client = new Client({
  user: 'postgres',
  host: 'falabelladb.cruw88i8wma8.us-east-2.rds.amazonaws.com',
  database: 'Falabella',
  password: 'Pepeelmago123',
  port: 5432,
});

// Exportar el cliente directamente
module.exports = client;


