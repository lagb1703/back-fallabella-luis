import { Module } from '@nestjs/common';
import { CoreModule } from './../newCore/core.module';
import { CoreModule as CoreModuleMongol} from './../mongoCore/core.module'
import { FooterModule } from './footer/footer.module';

@Module({
  imports: [CoreModule, CoreModuleMongol, FooterModule],
})
export class ModulesModule {}
