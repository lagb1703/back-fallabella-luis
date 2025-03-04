import { Module } from '@nestjs/common';
import { Configuration } from './config/config.key';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ConfigModule, DatabaseModule],
})
export class CoreModule {
  static port: number | string;

  constructor(configService: ConfigService) {
    CoreModule.port = configService.get(Configuration.PORT);
  }
}
