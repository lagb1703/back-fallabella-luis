import { Module } from '@nestjs/common';
import { FooterService } from './footer.service';
import { FooterController } from './footer.controller';
import { DatabaseModule } from './../../mongoCore/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [FooterService],
  controllers: [FooterController]
})
export class FooterModule {}
