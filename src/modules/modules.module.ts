import { Module } from '@nestjs/common';
import { CoreModule } from './../newCore/core.module';
import { CoreModule as CoreModuleMongol } from './../mongoCore/core.module'
import { FooterModule } from './footer/footer.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [CoreModule, CoreModuleMongol, FooterModule, AuthModule, UserModule],
})
export class ModulesModule { }
