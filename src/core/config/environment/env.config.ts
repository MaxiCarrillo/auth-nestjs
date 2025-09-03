import 'dotenv/config';
import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    PORT: z.string().transform(Number).pipe(z.number().min(0)).default(3000),

    JWT_ACCESS_SECRET: z.string().min(16).max(64),
    JWT_ACCESS_EXPIRY: z.string().transform(Number).pipe(z.number().min(0)),
    JWT_REFRESH_SECRET: z.string().min(16).max(64),
    JWT_REFRESH_EXPIRY: z.string().transform(Number).pipe(z.number().min(0)),

    GOOGLE_CLIENT_ID: z.string().min(16).max(128),
    GOOGLE_CLIENT_SECRET: z.string().min(16).max(64),
    GOOGLE_CALLBACK_URL: z.string(),
});

const { success, error, data } = envSchema.safeParse(process.env);

if (!success) {
    console.error("Environment variable validation failed:", error.format());
    process.exit(1);
}

export const {
    NODE_ENV,
    PORT,
    JWT_ACCESS_SECRET,
    JWT_ACCESS_EXPIRY,
    JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRY,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL
} = data;