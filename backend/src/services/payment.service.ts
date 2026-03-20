import Stripe from 'stripe'
import { env } from '../config/env'
import prisma from '../config/database'
import { AppError } from '../utils/apiResponse'

const stripe = env.STRIPE_SECRET_KEY
    ? new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' as any })
    : null

export class PaymentService {
    /** Create a Stripe PaymentIntent for an order */
    async createPaymentIntent(orderId: string, userId: string) {
        if (!stripe) throw new AppError(503, 'Payment service not configured')

        const order = await prisma.order.findUnique({ where: { id: orderId } })
        if (!order) throw new AppError(404, 'Order not found')
        if (order.userId !== userId) throw new AppError(403, 'Forbidden')

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(order.total * 100), // Stripe uses cents
            currency: env.STRIPE_CURRENCY,
            metadata: { orderId: order.id, orderNumber: order.orderNumber },
        })

        await prisma.order.update({
            where: { id: orderId },
            data: { stripePaymentId: paymentIntent.id },
        })

        return { clientSecret: paymentIntent.client_secret }
    }

    /** Handle Stripe webhook events */
    async handleWebhook(payload: Buffer, signature: string) {
        if (!stripe || !env.STRIPE_WEBHOOK_SECRET) {
            throw new AppError(503, 'Webhook not configured')
        }

        const event = stripe.webhooks.constructEvent(payload, signature, env.STRIPE_WEBHOOK_SECRET)

        switch (event.type) {
            case 'payment_intent.succeeded': {
                const pi = event.data.object as Stripe.PaymentIntent
                await prisma.order.update({
                    where: { stripePaymentId: pi.id },
                    data: { paymentStatus: 'COMPLETED', status: 'PROCESSING' },
                })
                break
            }
            case 'payment_intent.payment_failed': {
                const pi = event.data.object as Stripe.PaymentIntent
                await prisma.order.update({
                    where: { stripePaymentId: pi.id },
                    data: { paymentStatus: 'FAILED' },
                })
                break
            }
        }

        return { received: true }
    }
}

export const paymentService = new PaymentService()
