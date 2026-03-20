import { Request, Response, NextFunction } from 'express'
import { productService } from '../services/product.service'
import { sendSuccess } from '../utils/apiResponse'
import { AuthRequest } from '../middleware/authenticate'

export class ProductController {
    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await productService.list(req.query as any)
            sendSuccess(res, result.products, 200, { pagination: result.pagination })
        } catch (err) { next(err) }
    }

    async getBySlug(req: Request, res: Response, next: NextFunction) {
        try {
            const product = await productService.getBySlug(req.params.slug)
            sendSuccess(res, product)
        } catch (err) { next(err) }
    }

    async create(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const product = await productService.create(req.body)
            sendSuccess(res, product, 201)
        } catch (err) { next(err) }
    }

    async update(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const product = await productService.update(req.params.id, req.body)
            sendSuccess(res, product)
        } catch (err) { next(err) }
    }

    async delete(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            await productService.delete(req.params.id)
            sendSuccess(res, { message: 'Product deleted' })
        } catch (err) { next(err) }
    }

    async getCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const categories = await productService.getCategories()
            sendSuccess(res, categories)
        } catch (err) { next(err) }
    }

    async getBrands(req: Request, res: Response, next: NextFunction) {
        try {
            const brands = await productService.getBrands()
            sendSuccess(res, brands)
        } catch (err) { next(err) }
    }
}

export const productController = new ProductController()
