import rateLimit from 'express-rate-limit'
import { env } from '../config/env'

/** General API rate limiter */
export const apiLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX_REQUESTS,
    message: { success: false, error: 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
})

/** Stricter limiter for auth endpoints */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000,
    message: { success: false, error: 'Too many auth attempts, try again in 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
})

/** AI endpoint limiter */
export const aiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 1000,
    message: { success: false, error: 'AI rate limit exceeded, please wait a moment' },
    standardHeaders: true,
    legacyHeaders: false,
})
