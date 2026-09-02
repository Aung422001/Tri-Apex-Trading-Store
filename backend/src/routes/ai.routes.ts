import { Router } from 'express'
import { aiController } from '../controllers/ai.controller'
import { authenticate } from '../middleware/authenticate'
import { authorize } from '../middleware/authorize'
import { aiLimiter } from '../middleware/rateLimiter'

const router = Router()

// Public AI endpoints (rate limited)
router.post('/recommend', aiLimiter, (req, res, next) => aiController.recommend(req, res, next))
router.post('/chat', aiLimiter, (req, res, next) => aiController.chat(req, res, next))
router.post('/compare', aiLimiter, (req, res, next) => aiController.compare(req, res, next))
router.post('/price-compare', aiLimiter, (req, res, next) => aiController.priceCompare(req, res, next))

// Admin-only AI endpoints
router.post('/generate-description', authenticate, authorize('ADMIN'), (req, res, next) => aiController.generateDescription(req, res, next))
router.post('/analyze-image', authenticate, authorize('ADMIN'), (req, res, next) => aiController.analyzeImage(req, res, next))

export default router
