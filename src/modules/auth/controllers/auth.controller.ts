import { Body, ClassSerializerInterceptor, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { JWT_ACCESS_EXPIRY, JWT_REFRESH_EXPIRY } from 'src/core/config';
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from 'src/modules/common/constants';
import { Cookies } from 'src/modules/common/decorators';
import { CreateUserDto, UserResponseDTO } from 'src/modules/user/dtos';
import { UserService } from 'src/modules/user/services';
import { setCookie } from 'src/shared/utils';
import { LoginDto } from '../dtos';
import { GoogleOAuthGuard, JwtAccessAuthGuard, JwtRefreshAuthGuard, LocalAuthGuard } from '../guards';
import { AuthService } from '../services';

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {

    constructor(
        private authService: AuthService,
        private userService: UserService,
    ) { }

    @Get('me')
    @UseGuards(JwtAccessAuthGuard)
    @ApiOperation({ summary: 'Obtener información del usuario autenticado', description: 'Devuelve la información del usuario autenticado' })
    @ApiResponse({ status: 200, type: UserResponseDTO })
    async getAuthUser(
        @Cookies(ACCESS_TOKEN_COOKIE) accessToken: string,
    ): Promise<UserResponseDTO> {
        const user = await this.userService.findUserByToken(accessToken);
        if (!user) throw new UnauthorizedException("Invalid token");
        return new UserResponseDTO(user);
    }

    @Post('login')
    @UseGuards(LocalAuthGuard)
    @ApiOperation({
        summary: 'Iniciar sesión',
        description: 'Permite a un usuario iniciar sesión en la aplicación'
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
    @ApiOperation({
        summary: 'Cerrar sesión',
        description: 'Permite a un usuario cerrar sesión en la aplicación'
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
    @ApiOperation({
        summary: 'Registrar un nuevo usuario',
        description: 'Permite a un nuevo usuario registrarse en la aplicación'
    })
    async register(@Body() createUserDto: CreateUserDto) {
        await this.userService.create(createUserDto);
        return {
            message: 'Usuario registrado correctamente',
        };
    }

    @Post('refresh')
    @UseGuards(JwtRefreshAuthGuard)
    @ApiOperation({
        summary: 'Refrescar token',
        description: 'Permite a un usuario refrescar su token de acceso'
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
    @ApiOperation({
        summary: 'Redirección de Google',
        description: 'Maneja la redirección de Google después de la autenticación'
    })
    @UseGuards(GoogleOAuthGuard)
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
