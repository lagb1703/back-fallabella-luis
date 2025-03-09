import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Configuration } from './../../newCore/config/config.key';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService
  ) { }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      map((data) => {
        this.refreshToken(request, response);
        return data;
      }),
    );
  }

  async refreshToken(request: Request, response: Response): Promise<any> {
    const token = request.cookies?.Authorization;
    if (!token) {
      return;
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
      return;
    } catch {
      return;
    }
  }
}
