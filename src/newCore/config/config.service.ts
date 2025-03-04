import * as fs from 'fs';
import { parse } from 'dotenv';

export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor() {
    
    const isDevelopmentEnv = process.env.NODE_ENV !== 'production';

    if (isDevelopmentEnv) {
      const envFilePath = __dirname + '/../../../.env';
      const existsPath = fs.existsSync(envFilePath);

      if (!existsPath) {
        console.log('El archivo .env no existe');
        process.exit(0);
      }
      this.envConfig = parse(fs.readFileSync(envFilePath));
    } else {
      this.envConfig = {
        PORT: process.env.PORT,
        JWT_SECRET: process.env.JWT_SECRET,
        DB_USER: process.env.DB_USER,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_HOST: process.env.DB_HOST,
        DB_PORT: process.env.DB_PORT,
        DB_SERVICE_NAME: process.env.DB_SERVICE_NAME,
        ADMINPASS: process.env.ADMINPASS,
        DB_DATABSE: process.env.DB_DATABSE
      };
    }
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
