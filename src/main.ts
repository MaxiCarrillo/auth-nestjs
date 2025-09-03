import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { AppModule } from './app.module';
import { getSwaggerConfig, NODE_ENV, PORT } from './core/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CONFIGURACIÓN
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    }),
  );

  // SESSION PARA AUTENTICACIÓN CON GOOGLE
  app.use(
    session({
      secret: 'tu_secreto_super_seguro', // ¡pon un secreto fuerte en prod!
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: NODE_ENV === 'production',
      },
    }),
  );

  // SWAGGER
  const { swaggerConfig, swaggerSetupOptions } = getSwaggerConfig();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/api/docs', app, document, swaggerSetupOptions);

  await app.listen(PORT);
}
bootstrap();
