import { Module } from '@nestjs/common';
import { CoreModule } from './../newCore/core.module';
import { EnterpriseModule } from './enterprise/enterprise.module';

@Module({
  imports: [CoreModule, EnterpriseModule],
})
export class ModulesModule {}
