import { Request, Response, NextFunction } from 'express'
import { aiService } from '../services/ai.service'
import { sendSuccess, sendError } from '../utils/apiResponse'

export class AIController {
    async recommend(req: Request, res: Response, next: NextFunction) {
        try {
            const recommendations = await aiService.getRecommendations(req.body)
            sendSuccess(res, recommendations)
        } catch (err: any) {
            if (err.message?.includes('not configured')) {
                return sendError(res, 'AI service not available', 503)
            }
            next(err)
        }
    }

    async chat(req: Request, res: Response, next: NextFunction) {
        try {
            const { message, history = [] } = req.body
            if (!message) return sendError(res, 'Message is required', 400)

            const response = await aiService.chat(message, history)
            sendSuccess(res, { reply: response })
        } catch (err: any) {
            if (err.message?.includes('not configured')) {
                return sendSuccess(res, {
                    reply: "I'm currently unavailable. Please contact kht@triapextradinggroupmm.com for assistance.",
                })
            }
            next(err)
        }
    }

    async compare(req: Request, res: Response, next: NextFunction) {
        try {
            const { productIds } = req.body
            const comparison = await aiService.compareProducts(productIds)
            sendSuccess(res, comparison)
        } catch (err: any) {
            if (err.message?.includes('not configured')) {
                return sendError(res, 'AI service not available', 503)
            }
            next(err)
        }
    }

    async generateDescription(req: Request, res: Response, next: NextFunction) {
        try {
            const description = await aiService.generateDescription(req.body)
            sendSuccess(res, description)
        } catch (err: any) {
            if (err.message?.includes('not configured')) {
                return sendError(res, 'AI service not available', 503)
            }
            next(err)
        }
    }

    async analyzeImage(req: Request, res: Response, next: NextFunction) {
        try {
            const { imageBase64, mimeType } = req.body
            if (!imageBase64 || !mimeType) return sendError(res, 'Image data and mimeType required', 400)

            const analysis = await aiService.analyzeImage(imageBase64, mimeType)
            sendSuccess(res, analysis)
        } catch (err: any) {
            if (err.message?.includes('not configured')) {
                return sendError(res, 'AI service not available', 503)
            }
            next(err)
        }
    }
}

export const aiController = new AIController()
