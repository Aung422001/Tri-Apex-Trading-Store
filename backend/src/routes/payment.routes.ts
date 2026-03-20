import { Router } from 'express'
import { paymentController } from '../controllers/payment.controller'
import { authenticate } from '../middleware/authenticate'
import express from 'express'

const router = Router()

router.post('/intent', authenticate, (req, res, next) => paymentController.createIntent(req, res, next))
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res, next) => paymentController.webhook(req, res, next))

export default router
