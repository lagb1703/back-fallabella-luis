import { Configuration } from "./config.key";
import { ConfigService } from "./config.service";
import { PoolConfig } from "pg";

const config = new ConfigService();

export const databaseProvider: PoolConfig = {
  user: config.get(Configuration.DB_USER),
  password: config.get(Configuration.DB_PASSWORD),
  port: Number(config.get(Configuration.DB_PORT)),
  database: config.get(Configuration.DB_DATABSE),
  host: config.get(Configuration.DB_HOST)
};
