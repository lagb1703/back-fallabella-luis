import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Response, Request } from 'express';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserAcountInterface } from '../user/interfaces';
import { ConfigService } from '@nestjs/config';
import { Configuration } from './../../newCore/config/config.key';
import * as Bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    private readonly logger: Logger = new Logger(AuthService.name);
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    async signIn(email: string, pass: string, response: Response): Promise<{ access_token: string }> {
        const user: UserAcountInterface = await this.userService.getUserAcountByEmail(email);
        if (!user) {
            throw new UnauthorizedException();
        }
        const isMatch = await Bcrypt.compare(pass, user.password);
        if (!isMatch) {
            throw new UnauthorizedException();
        }
        const { password, ...result } = user;
        const access = await this.jwtService.signAsync(
            result,
            {
                secret: this.configService.get(Configuration.JWT_SECRET)
            }
        );
        response.cookie(
            'Authorization',
            `${access}`,
            { httpOnly: true, maxAge: 3600000 });
        return {
            access_token: access,
        };
    }

    async refreshToken(request: Request, response: Response): Promise<{ access_token: string }> {
        const token = request.cookies?.Authorization;
        if (!token) {
            throw new UnauthorizedException('Token no encontrado');
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get(Configuration.JWT_SECRET),
                ignoreExpiration: true,
            });
            const { iat, exp, ...userData } = payload;
            const newToken = await this.jwtService.signAsync(userData, {
                secret: this.configService.get(Configuration.JWT_SECRET)
            });
            response.cookie('Authorization', newToken, { httpOnly: true, maxAge: 3600000 });
            return { access_token: newToken };
        } catch {
            throw new UnauthorizedException();
        }
    }
}
