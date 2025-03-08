import { Body, Controller, Post, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { UserAccountDto } from './dtos';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() userAccount: UserAccountDto, @Res({ passthrough: true }) response: Response) {
        return this.authService.signIn(userAccount.email, userAccount.password, response);
    }

}
