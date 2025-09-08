import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_HOST, DATABASE_NAME, DATABASE_PORT } from './core/config';
import { AuthModule } from './modules/auth/auth.module';
import { HttpExceptionFilter, TransformResponseInterceptor } from './modules/common/interceptors';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`),
    AuthModule,
    UserModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
  ]
})
export class AppModule { }
