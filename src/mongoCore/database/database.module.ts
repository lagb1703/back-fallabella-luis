import { Module } from '@nestjs/common';
import { MongoService } from './services/mongol.service';

@Module({
  providers: [MongoService],
  exports: [MongoService],
})
export class DatabaseModule {}
