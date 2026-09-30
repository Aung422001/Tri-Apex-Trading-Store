import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { env } from './config/env'
import routes from './routes'
import { errorHandler } from './middleware/errorHandler'
import { apiLimiter } from './middleware/rateLimiter'

const app = express()
app.disable('x-powered-by')

// Render terminates TLS in front of the app. Without this, req.ip is the
// proxy's address, so the rate limiter puts every visitor in one bucket and
// the whole site gets 429s after 100 requests.
if (env.NODE_ENV === 'production') {
    app.set('trust proxy', 1)
}

// Security
app.use(helmet())
app.use(cors({
    origin: env.CORS_ORIGIN.split(','),
    credentials: true,
}))

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(env.COOKIE_SECRET))

// Logging
if (env.NODE_ENV !== 'test') {
    app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'))
}

// Rate limiting
app.use(env.API_PREFIX, apiLimiter)

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'triapex-api' })
})

// API routes
app.use(env.API_PREFIX, routes)

// Global error handler (must be last)
app.use(errorHandler)

export default app

// Trigger backend restart
