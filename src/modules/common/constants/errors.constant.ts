export const errors = {
    UNAUTHORIZED_REQUEST: {
        statusCode: 401,
        message: 'Acceso no autorizado',
        error: 'Unauthorized Exception'
    },
    INVALID_REFRESH_TOKEN: {
        statusCode: 401,
        message: 'Refresh Token no válido',
        error: 'Unauthorized Exception'
    },
    INVALID_ACCESS_TOKEN: {
        statusCode: 401,
        message: 'Access Token no válido',
        error: 'Unauthorized Exception'
    }
}