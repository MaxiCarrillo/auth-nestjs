import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAccessStrategy } from '../auth/strategies';
import { UserController } from './controller';
import { User, UserSchema } from './schemas';
import { UserService } from './services';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule
    ],
    controllers: [UserController],
    providers: [UserService, JwtAccessStrategy],
    exports: [UserService]
})
export class UserModule { }
