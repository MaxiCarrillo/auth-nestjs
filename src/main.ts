import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { AppModule } from './app.module';
import { getSwaggerConfig, GOOGLE_SECRET, NODE_ENV, PORT } from './core/config';
import { ACCEPT_VERSION_HEADER } from './modules/common/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CONFIGURACIÓN
  app.setGlobalPrefix('api');

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    }),
  );

  app.enableVersioning({
    type: VersioningType.HEADER,
    header: ACCEPT_VERSION_HEADER,
  });

  // SESSION PARA AUTENTICACIÓN CON GOOGLE
  app.use(
    session({
      secret: GOOGLE_SECRET,
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
  SwaggerModule.setup(`/api/docs`, app, document, swaggerSetupOptions);

  await app.listen(PORT);
}
bootstrap();
