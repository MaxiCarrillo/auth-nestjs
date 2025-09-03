import { CookieOptions, Response } from "express";
import { NODE_ENV } from "src/core/config";

export const setCookie = (response: Response, name: string, value: string, options: CookieOptions) => {
    response.cookie(name, value, {
        path: '/',
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: NODE_ENV === 'production' ? 'strict' : 'lax',

        ...options,
    });
};

// httpOnly, indica si la cookie solo debe ser accesible a través de HTTP(S) y no a través de JavaScript
// Si se establece en true, la cookie no será accesible desde el lado del cliente
// Si se establece en false, la cookie será accesible desde el lado del cliente

// secure, indica si la cookie solo debe enviarse a través de conexiones HTTPS
// Si se establece en true, la cookie solo se enviará si la conexión es segura
// Si se establece en false, la cookie se enviará en todas las conexiones

// domain, especifica el dominio para el cual la cookie es válida
// Si se establece, la cookie solo se enviará al dominio especificado
// Si no se establece, se utilizará el dominio del sitio que creó la cookie

// sameSite, se refiere a la política de envío de cookies en solicitudes entre sitios
// lax: permite el envío de cookies en solicitudes GET de sitios de confianza
// strict: solo permite el envío de cookies en solicitudes del mismo sitio
// none: no envía cookies en solicitudes entre sitios