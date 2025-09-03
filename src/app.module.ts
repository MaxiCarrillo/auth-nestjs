import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { DATABASE_HOST, DATABASE_NAME, DATABASE_PORT } from './core/config';

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`),
    AuthModule,
    UserModule
  ],
  controllers: [],
})
export class AppModule { }
