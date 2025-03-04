import { Module } from '@nestjs/common';
import { PlpgsqlService } from './services';
import { PostgreService } from './services/postgres.service';

@Module({
  providers: [PostgreService, PlpgsqlService],
  exports: [PostgreService, PlpgsqlService],
})
export class DatabaseModule {}
