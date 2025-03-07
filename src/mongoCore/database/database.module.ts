import { Module } from '@nestjs/common';
import { MongoService } from './services/mongol.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [MongoService],
  exports: [MongoService],
})
export class DatabaseModule {}
