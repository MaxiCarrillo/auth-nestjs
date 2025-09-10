import { JWT_ACCESS_EXPIRY, JWT_REFRESH_EXPIRY } from '@/core/config';
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '@/modules/common/constants';
import { ApiVersionHeader, Cookies } from '@/modules/common/decorators';
import { ApiStandardResponse } from '@/modules/common/decorators/api-response.decorator';
import { CreateUserDto, UserResponseDTO } from '@/modules/user/dtos';
import { UserService } from '@/modules/user/services';
import { setCookie } from '@/shared/utils';
import { Body, ClassSerializerInterceptor, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import type { Request, Response } from 'express';
import { LoginDto } from '../dtos';
import { GoogleOAuthGuard, JwtAccessAuthGuard, JwtRefreshAuthGuard, LocalAuthGuard } from '../guards';
import { AuthService } from '../services';

@ApiVersionHeader('1')
@Controller({ path: 'auth', version: ['1'] })
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {

    constructor(
        private authService: AuthService,
        private userService: UserService,
    ) { }

    @Get('me')
    @UseGuards(JwtAccessAuthGuard)
    @ApiStandardResponse({
        summary: 'Get Authenticated User',
        description: 'Gets the currently authenticated user based on the access token provided in the cookies.',
        type: UserResponseDTO,
    })
    async getAuthUser(
        @Cookies(ACCESS_TOKEN_COOKIE) accessToken: string,
    ): Promise<UserResponseDTO> {
        const user = await this.userService.findUserByToken(accessToken);
        return plainToInstance(UserResponseDTO, user);
    }

    @Post('login')
    @UseGuards(LocalAuthGuard)
    @ApiStandardResponse({
        summary: 'Login',
        description: 'Allows a user to log in to the application with their credentials.',
    })
    async login(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) response: Response
    ) {
        const { access_token, refresh_token } = this.authService.login(loginDto);

        setCookie(response, ACCESS_TOKEN_COOKIE, access_token, {
            maxAge: JWT_ACCESS_EXPIRY,
        });

        setCookie(response, REFRESH_TOKEN_COOKIE, refresh_token, {
            maxAge: JWT_REFRESH_EXPIRY,
        });

        return {
            message: 'Se ha iniciado sesión correctamente',
        };
    }

    @Post('logout')
    @ApiStandardResponse({
        summary: 'Logout',
        description: 'Allows a user to log out of the application.',
    })
    async logout(
        @Cookies(ACCESS_TOKEN_COOKIE) accessToken: string,
        @Cookies(REFRESH_TOKEN_COOKIE) refreshToken: string,
        @Res({ passthrough: true }) response: Response
    ) {
        if (accessToken) response.clearCookie(ACCESS_TOKEN_COOKIE);
        if (refreshToken) response.clearCookie(REFRESH_TOKEN_COOKIE);

        return {
            message: 'Se ha cerrado sesión correctamente',
        };
    }

    @Post('register')
    @ApiStandardResponse({
        summary: 'Register',
        description: 'Allows a user to register in the application.',
        status: 201,
    })
    async register(@Body() createUserDto: CreateUserDto) {
        await this.userService.create(createUserDto);
        return {
            message: 'Usuario registrado correctamente',
        };
    }

    @Post('refresh')
    @UseGuards(JwtRefreshAuthGuard)
    @ApiStandardResponse({
        summary: 'Refresh Token',
        description: 'Allows a user to refresh their access token.',
    })
    async refresh(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response
    ) {
        const { access_token, refresh_token } = this.authService.refreshToken(request.cookies[REFRESH_TOKEN_COOKIE]);
        setCookie(response, ACCESS_TOKEN_COOKIE, access_token, {
            maxAge: JWT_ACCESS_EXPIRY,
        });
        setCookie(response, REFRESH_TOKEN_COOKIE, refresh_token, {
            maxAge: JWT_REFRESH_EXPIRY,
        });
        return {
            message: 'Token refrescado correctamente',
        };
    }

    @Get('google')
    @ApiOperation({
        summary: 'Iniciar sesión con Google',
        description: 'Permite a un usuario iniciar sesión en la aplicación utilizando su cuenta de Google'
    })
    @ApiResponse({ status: 302, description: 'Redirección a Google OAuth2' })
    @UseGuards(GoogleOAuthGuard)
    async googleAuth(@Req() request) { }

    @Get('google-redirect')
    @UseGuards(GoogleOAuthGuard)
    @ApiStandardResponse({
        summary: 'Google OAuth Redirect',
        description: 'Handles the Google OAuth redirect after authentication.',
    })
    googleAuthRedirect(
        @Req() request,
        @Res({ passthrough: true }) response: Response
    ) {
        const user = request.user;
        if (!user) {
            throw new UnauthorizedException();
        }
        const { access_token, refresh_token } = this.authService.googleLogin(user);
        setCookie(response, ACCESS_TOKEN_COOKIE, access_token, {
            maxAge: JWT_ACCESS_EXPIRY,
        });
        setCookie(response, REFRESH_TOKEN_COOKIE, refresh_token, {
            maxAge: JWT_REFRESH_EXPIRY,
        });
        return {
            message: 'Inicio de sesión con Google exitoso',
        };
    }
}
