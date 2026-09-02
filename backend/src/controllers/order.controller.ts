import { Request, Response, NextFunction } from 'express'
import { orderService } from '../services/order.service'
import { sendSuccess } from '../utils/apiResponse'
import { AuthRequest } from '../middleware/authenticate'

export class OrderController {
    async create(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const order = await orderService.createOrder(req.user!.id, req.body)
            sendSuccess(res, order, 201)
        } catch (err) { next(err) }
    }

    async getUserOrders(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1
            const limit = parseInt(req.query.limit as string) || 10
            const result = await orderService.getUserOrders(req.user!.id, page, limit)
            sendSuccess(res, result.orders, 200, {
                pagination: { page: result.page, limit: result.limit, total: result.total, totalPages: result.totalPages },
            })
        } catch (err) { next(err) }
    }

    async getById(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const order = await orderService.getOrderById(req.params.id, req.user!.id)
            sendSuccess(res, order)
        } catch (err) { next(err) }
    }

    async cancel(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const order = await orderService.cancelOrder(req.params.id, req.user!.id)
            sendSuccess(res, order)
        } catch (err) { next(err) }
    }

    async adminGetAll(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1
            const limit = parseInt(req.query.limit as string) || 20
            const result = await orderService.getAllOrders(page, limit)
            sendSuccess(res, result.orders, 200, {
                pagination: { page: result.page, limit: result.limit, total: result.total, totalPages: result.totalPages },
            })
        } catch (err) { next(err) }
    }

    async adminUpdateStatus(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const order = await orderService.updateStatus(req.params.id, req.body.status, req.body.trackingNumber)
            sendSuccess(res, order)
        } catch (err) { next(err) }
    }

    async track(req: Request, res: Response, next: NextFunction) {
        try {
            const order = await orderService.trackOrder(req.params.orderNumber)
            sendSuccess(res, order)
        } catch (err) { next(err) }
    }
}

export const orderController = new OrderController()
