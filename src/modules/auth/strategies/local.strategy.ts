import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { errors } from "src/modules/common/constants";
import { AuthService } from "../services";


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {

    constructor(private authService: AuthService) {
        super({ usernameField: 'email' });
    }

    validate(email: string, password: string) {
        const user = this.authService.validateUser(email, password);
        if (!user) throw new UnauthorizedException(errors.UNAUTHORIZED_REQUEST);
        return user;
    }
}