import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from "@/core/config";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/modules/common/constants";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../interfaces";

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt-access') {
    constructor() {
        super({
            secretOrKey: JWT_ACCESS_SECRET,
            passReqToCallback: false,
            ignoreExpiration: false,
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                const token = request.cookies[ACCESS_TOKEN_COOKIE];
                if (!token) throw new UnauthorizedException("No access token");
                return token;
            }])
        })
    }

    validate(payload: JwtPayload) {
        return payload;
    }
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor() {
        super({
            secretOrKey: JWT_REFRESH_SECRET,
            passReqToCallback: false,
            ignoreExpiration: false,
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                const token = request.cookies[REFRESH_TOKEN_COOKIE];
                if (!token) throw new UnauthorizedException("No refresh token");
                return token;
            }])
        })
    }

    validate(payload: any) {
        return payload;
    }

}