import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JWT_ACCESS_EXPIRY, JWT_ACCESS_SECRET } from 'src/core/config';
import { UserModule } from '../user/user.module';
import { AuthController } from './controllers';
import { AuthService } from './services';
import { GoogleStrategy, JwtAccessStrategy, JwtRefreshStrategy, LocalStrategy } from './strategies';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: JWT_ACCESS_SECRET,
      signOptions: { expiresIn: JWT_ACCESS_EXPIRY / 1000 },
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtAccessStrategy, JwtRefreshStrategy, GoogleStrategy]
})
export class AuthModule { }
