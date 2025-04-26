const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let conection = null;

async function connect() {
  if (conection) return conection;
  conection = await client.connect();
  return conection;
}

module.exports = connect;