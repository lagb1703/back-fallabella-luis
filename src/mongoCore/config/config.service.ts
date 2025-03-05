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
        MONGOPORT: process.env.MONGOPORT,
        MONGOHOST: process.env.MONGOHOST,
        MONGOUSERNAME: process.env.MONGOUSERNAME,
        MONGOPASSWORD: process.env.MONGOPASSWORD
      };
    }
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
