import { Router } from 'express'
import { feedbackController } from '../controllers/feedback.controller'
import { authenticate } from '../middleware/authenticate'
import { authorize } from '../middleware/authorize'
import { apiLimiter } from '../middleware/rateLimiter'

const router = Router()

// Public route to submit feedback
router.post('/', apiLimiter, (req, res, next) => feedbackController.submitFeedback(req, res, next))

// Admin route to view feedback
router.get('/', authenticate, authorize('ADMIN'), (req, res, next) => feedbackController.getFeedback(req, res, next))

export default router
