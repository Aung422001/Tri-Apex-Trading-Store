import { Request, Response, NextFunction } from 'express'
import { aiService, toAiError } from '../services/ai.service'
import { priceComparisonService } from '../services/price-comparison.service'
import { sendSuccess, sendError } from '../utils/apiResponse'

export class AIController {
    async recommend(req: Request, res: Response, next: NextFunction) {
        try {
            const recommendations = await aiService.getRecommendations(req.body)
            sendSuccess(res, recommendations)
        } catch (err) {
            const appErr = toAiError(err)
            sendError(res, appErr.message, appErr.statusCode)
        }
    }

    async chat(req: Request, res: Response, next: NextFunction) {
        try {
            const { message, history = [] } = req.body
            if (!message) return sendError(res, 'Message is required', 400)

            const response = await aiService.chat(message, history)
            sendSuccess(res, { reply: response })
        } catch (err) {
            // Chat always answers with a friendly reply — a support widget that
            // renders an HTTP error is worse than one that hands over a phone number.
            const { statusCode } = toAiError(err)

            if (statusCode === 429) {
                return sendSuccess(res, {
                    reply: "I'm handling too many requests right now! Please wait a moment and try again.",
                })
            }
            return sendSuccess(res, {
                reply: "Hi! I'm currently offline for maintenance. Please contact kht@triapextradinggroupmm.com or call +95 944 999 7080 for assistance.",
            })
        }
    }

    async compare(req: Request, res: Response, next: NextFunction) {
        try {
            const { productIds } = req.body
            const comparison = await aiService.compareProducts(productIds)
            sendSuccess(res, comparison)
        } catch (err) {
            const appErr = toAiError(err)
            sendError(res, appErr.message, appErr.statusCode)
        }
    }

    async generateDescription(req: Request, res: Response, next: NextFunction) {
        try {
            const description = await aiService.generateDescription(req.body)
            sendSuccess(res, description)
        } catch (err) {
            const appErr = toAiError(err)
            sendError(res, appErr.message, appErr.statusCode)
        }
    }

    async analyzeImage(req: Request, res: Response, next: NextFunction) {
        try {
            const { imageBase64, mimeType } = req.body
            if (!imageBase64 || !mimeType) return sendError(res, 'Image data and mimeType required', 400)

            const analysis = await aiService.analyzeImage(imageBase64, mimeType)
            sendSuccess(res, analysis)
        } catch (err) {
            const appErr = toAiError(err)
            sendError(res, appErr.message, appErr.statusCode)
        }
    }
    async priceCompare(req: Request, res: Response, next: NextFunction) {
        try {
            const { productName, ourPrice, currency } = req.body
            if (!productName || ourPrice === undefined) {
                return sendError(res, 'productName and ourPrice are required', 400)
            }
            const result = await priceComparisonService.comparePrice(productName, Number(ourPrice), currency)
            sendSuccess(res, result)
        } catch (err) {
            next(err)
        }
    }
}

export const aiController = new AIController()
