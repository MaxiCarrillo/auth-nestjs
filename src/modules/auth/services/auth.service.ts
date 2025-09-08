import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_ACCESS_EXPIRY, JWT_ACCESS_SECRET, JWT_REFRESH_EXPIRY, JWT_REFRESH_SECRET } from 'src/core/config';
import { LoginDto } from '../dtos';
import { UserService } from 'src/modules/user/services';
import { User } from 'src/modules/user/schemas';
import { JwtPayload } from '../interfaces';

@Injectable()
export class AuthService {

    constructor(
        private jwtService: JwtService,
        private userService: UserService
    ) { }

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.userService.findByEmailWithPassword(email);
        if (user && user.password === password) {
            return user;
        }
        return null;
    }

    login(data: LoginDto) {
        const payload: JwtPayload = { email: data.email }
        return this.generateTokens(payload);
    }

    generateTokens(payload: JwtPayload) {
        const access_token = this.jwtService.sign(payload, {
            secret: JWT_ACCESS_SECRET,
            expiresIn: JWT_ACCESS_EXPIRY / 1000
        });
        const refresh_token = this.jwtService.sign(payload, {
            secret: JWT_REFRESH_SECRET,
            expiresIn: JWT_REFRESH_EXPIRY / 1000
        });
        return {
            access_token,
            refresh_token
        };
    }

    refreshToken(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken, { secret: JWT_REFRESH_SECRET });
            return this.generateTokens({ email: payload.email });
        } catch (error) {
            throw new UnauthorizedException("Invalid refresh token");
        }
    }

    googleLogin(user: User) {
        const tokens = this.generateTokens({ email: user.email });
        return tokens;
    }
}
