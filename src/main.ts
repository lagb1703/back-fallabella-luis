import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors();
  // Define la ruta del api
  app.setGlobalPrefix('api/v1');
  app.use(cookieParser());
  // Define la documentación de la api
  const config = new DocumentBuilder()
    .setTitle('Core Utp (Cambiar por titulo descriptivo) ')
    .setDescription('Api ... (cambiar por descripción descriptiva)')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'Bearer',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);

  // Define las validaciones de los Dto
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  // Inicia el servidor
  await app.listen(configService.get('PORT'), () =>
    logger.log(
      `Api listening on http://localhost:${configService.get('PORT')}/api/v1`,
    ),
  );
}
bootstrap();
