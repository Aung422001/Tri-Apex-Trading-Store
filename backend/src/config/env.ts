import { z } from 'zod'
import path from 'path'
import dotenv from 'dotenv'

// Load .env from backend root
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().default(5000),
    APP_NAME: z.string().default('Triapex Trading Group'),
    APP_URL: z.string().default('http://localhost:3000'),
    API_URL: z.string().default('http://localhost:5000'),
    API_PREFIX: z.string().default('/api/v1'),

    // Database
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

    // Redis
    REDIS_URL: z.string().optional(),
    REDIS_TTL_DEFAULT: z.coerce.number().default(300),

    // JWT
    JWT_SECRET: z.string().min(10, 'JWT_SECRET must be at least 10 characters'),
    JWT_EXPIRES_IN: z.string().default('7d'),
    JWT_REFRESH_SECRET: z.string().min(10, 'JWT_REFRESH_SECRET must be at least 10 characters'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
    COOKIE_SECRET: z.string().default('triapex-cookie-secret'),

    // Google OAuth
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),

    // Gemini AI
    GEMINI_API_KEY: z.string().optional(),
    ANTHROPIC_API_KEY: z.string().optional(),
    GEMINI_MODEL_FLASH: z.string().default('gemini-2.5-flash'),
    // gemini-2.0-flash 404s on the current API key — don't default to a model
    // that isn't reachable.
    GEMINI_MODEL_PRO: z.string().default('gemini-2.5-flash'),
    GEMINI_MAX_TOKENS: z.coerce.number().default(1024),
    GEMINI_TEMPERATURE: z.coerce.number().default(0.7),

    // Stripe
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
    STRIPE_CURRENCY: z.string().default('mmk'),

    // Cloudinary
    CLOUDINARY_CLOUD_NAME: z.string().optional(),
    CLOUDINARY_API_KEY: z.string().optional(),
    CLOUDINARY_API_SECRET: z.string().optional(),

    // Email
    SENDGRID_API_KEY: z.string().optional(),
    EMAIL_FROM: z.string().default('noreply@triapextrading.com'),
    EMAIL_FROM_NAME: z.string().default('Triapex Trading Group'),
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.coerce.number().optional(),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),

    // CORS
    CORS_ORIGIN: z.string().default('http://localhost:3000'),

    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
    RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),

    // Shipping
    FREE_SHIPPING_THRESHOLD: z.coerce.number().default(800000),
    DEFAULT_SHIPPING_COST: z.coerce.number().default(15000),
    EXPRESS_SHIPPING_COST: z.coerce.number().default(35000),

    // Admin
    ADMIN_EMAIL: z.string().default('admin@triapextrading.com'),
    ADMIN_DEFAULT_PASSWORD: z.string().default('ChangeThisPassword123!'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
    console.error('❌ Invalid environment variables:')
    console.error(parsed.error.flatten().fieldErrors)
    process.exit(1)
}

export const env = parsed.data
