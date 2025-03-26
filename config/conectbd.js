const {Pool} = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'falabelladb.cruw88i8wma8.us-east-2.rds.amazonaws.com',
  database: 'Falabella',
  password: 'Pepeelmago123',
  port: 5432,
});

module.exports = pool;