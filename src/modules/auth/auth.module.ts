import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from './../../newCore/config/config.service';
import { Configuration } from './../../newCore/config/config.key';

const configService: ConfigService = new ConfigService();

@Module({
  imports: [
    ConfigModule,
    UserModule,
    JwtModule.register({
      global: true,
      secret: configService.get(Configuration.JWT_SECRET),
      signOptions: { expiresIn: '1h' },
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
