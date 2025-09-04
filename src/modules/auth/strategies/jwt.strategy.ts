import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from "src/core/config";
import { ACCESS_TOKEN_COOKIE, errors, REFRESH_TOKEN_COOKIE } from "src/modules/common/constants";
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
                if (!token) throw new UnauthorizedException(errors.UNAUTHORIZED_REQUEST); 
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
                if (!token) throw new UnauthorizedException(errors.UNAUTHORIZED_REQUEST);
                return token;
            }])
        })
    }

    validate(payload: any) {
        return payload;
    }

}