import { Request, Response, NextFunction } from 'express'
import { paymentService } from '../services/payment.service'
import { sendSuccess } from '../utils/apiResponse'
import { AuthRequest } from '../middleware/authenticate'

export class PaymentController {
    async createIntent(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const result = await paymentService.createPaymentIntent(req.body.orderId, req.user!.id)
            sendSuccess(res, result)
        } catch (err) { next(err) }
    }

    async webhook(req: Request, res: Response, next: NextFunction) {
        try {
            const sig = req.headers['stripe-signature'] as string
            const result = await paymentService.handleWebhook(req.body, sig)
            sendSuccess(res, result)
        } catch (err) { next(err) }
    }
}

export const paymentController = new PaymentController()
