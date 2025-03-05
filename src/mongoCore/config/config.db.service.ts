import { Configuration } from "./config.key";
import { ConfigService } from "./config.service";
import { MongoClientOptions, ServerApiVersion } from "mongodb";

const config = new ConfigService();

export const URI = 
  `mongodb://${config.get(Configuration.MONGOHOST)}:${config.get(Configuration.MONGOPORT)}/${config.get(Configuration.MONGODATABASE)}`;

export const databaseProvider: MongoClientOptions = {
  serverApi: ServerApiVersion.v1,
  auth: {
    username: config.get(Configuration.MONGOUSERNAME),
    password: config.get(Configuration.MONGOPASSWORD)
  },
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  authSource: "admin",
  tls: false,
};
