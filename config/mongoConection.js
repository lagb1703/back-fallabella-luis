const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://Andy:Andy123@labingesoft.qosx9.mongodb.net/?retryWrites=true&w=majority&appName=LabIngeSoft";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
module.exports = client;