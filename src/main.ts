import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { AppModule } from './app.module';
import { getSwaggerConfig, GOOGLE_SECRET, NODE_ENV, PORT } from './core/config';
import { API_VERSION } from './modules/common/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CONFIGURACIÓN
  app.setGlobalPrefix(`api/${API_VERSION}`);

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
  SwaggerModule.setup(`/api/${API_VERSION}/docs`, app, document, swaggerSetupOptions);

  await app.listen(PORT);
}
bootstrap();
