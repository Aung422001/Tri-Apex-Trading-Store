import { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
import { sendSuccess } from '../utils/apiResponse'

const prisma = new PrismaClient()

export class FeedbackController {
    /** Submit customer feedback */
    async submitFeedback(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, email, message, rating } = req.body

            const feedback = await prisma.feedback.create({
                data: {
                    name,
                    email,
                    message,
                    rating: rating ? parseInt(rating) : null,
                },
            })

            sendSuccess(res, feedback, 201)
        } catch (error) {
            next(error)
        }
    }

    /** Get all customer feedback (admin only) */
    async getFeedback(req: Request, res: Response, next: NextFunction) {
        try {
            const limit = parseInt(req.query.limit as string) || 20
            const page = parseInt(req.query.page as string) || 1
            const skip = (page - 1) * limit

            const feedback = await prisma.feedback.findMany({
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip,
            })

            const total = await prisma.feedback.count()

            sendSuccess(res, feedback, 200, {
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            })
        } catch (error) {
            next(error)
        }
    }
}

export const feedbackController = new FeedbackController()
