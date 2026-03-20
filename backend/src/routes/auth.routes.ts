import { Router } from 'express'
import { authController } from '../controllers/auth.controller'
import { authenticate } from '../middleware/authenticate'
import { validate } from '../middleware/validate'
import { registerSchema, loginSchema } from '../schemas/auth.schema'
import { authLimiter } from '../middleware/rateLimiter'

const router = Router()

router.post('/register', authLimiter, validate(registerSchema), (req, res, next) => authController.register(req, res, next))
router.post('/login', authLimiter, validate(loginSchema), (req, res, next) => authController.login(req, res, next))
router.post('/refresh', (req, res, next) => authController.refresh(req, res, next))
router.post('/logout', authenticate, (req, res, next) => authController.logout(req, res, next))
router.get('/me', authenticate, (req, res, next) => authController.getMe(req, res, next))

router.post('/forgot-password', authLimiter, (req, res, next) => authController.forgotPassword(req, res, next))
router.post('/reset-password', authLimiter, (req, res, next) => authController.resetPassword(req, res, next))

export default router
