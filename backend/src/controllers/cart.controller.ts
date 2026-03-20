import { Response, NextFunction } from 'express'
import prisma from '../config/database'
import { sendSuccess } from '../utils/apiResponse'
import { AppError } from '../utils/apiResponse'
import { AuthRequest } from '../middleware/authenticate'

export class CartController {
    /** Get user's cart */
    async getCart(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            let cart = await prisma.cart.findUnique({
                where: { userId: req.user!.id },
                include: {
                    items: {
                        include: {
                            product: {
                                select: { id: true, name: true, slug: true, price: true, comparePrice: true, stock: true, images: { take: 1 } },
                            },
                            variant: { select: { id: true, name: true, price: true, stock: true } },
                        },
                    },
                },
            })

            if (!cart) {
                cart = await prisma.cart.create({
                    data: { userId: req.user!.id },
                    include: {
                        items: {
                            include: {
                                product: { select: { id: true, name: true, slug: true, price: true, comparePrice: true, stock: true, images: { take: 1 } } },
                                variant: { select: { id: true, name: true, price: true, stock: true } },
                            },
                        },
                    },
                })
            }

            sendSuccess(res, cart)
        } catch (err) { next(err) }
    }

    /** Add item to cart */
    async addItem(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { productId, variantId, quantity = 1 } = req.body
            const userId = req.user!.id

            let cart = await prisma.cart.findUnique({ where: { userId } })
            if (!cart) cart = await prisma.cart.create({ data: { userId } })

            // Check if item already exists
            const existing = await prisma.cartItem.findFirst({
                where: { cartId: cart.id, productId, variantId: variantId || null },
            })

            if (existing) {
                await prisma.cartItem.update({
                    where: { id: existing.id },
                    data: { quantity: existing.quantity + quantity },
                })
            } else {
                await prisma.cartItem.create({
                    data: { cartId: cart.id, productId, variantId: variantId || null, quantity },
                })
            }

            const updated = await prisma.cart.findUnique({
                where: { userId },
                include: {
                    items: {
                        include: {
                            product: { select: { id: true, name: true, slug: true, price: true, stock: true, images: { take: 1 } } },
                            variant: { select: { id: true, name: true, price: true, stock: true } },
                        },
                    },
                },
            })

            sendSuccess(res, updated)
        } catch (err) { next(err) }
    }

    /** Update cart item quantity */
    async updateItem(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { quantity } = req.body
            const item = await prisma.cartItem.findUnique({
                where: { id: req.params.itemId },
                include: { cart: true },
            })

            if (!item || item.cart.userId !== req.user!.id) {
                throw new AppError(404, 'Cart item not found')
            }

            if (quantity <= 0) {
                await prisma.cartItem.delete({ where: { id: item.id } })
            } else {
                await prisma.cartItem.update({ where: { id: item.id }, data: { quantity } })
            }

            sendSuccess(res, { message: 'Cart updated' })
        } catch (err) { next(err) }
    }

    /** Remove item from cart */
    async removeItem(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const item = await prisma.cartItem.findUnique({
                where: { id: req.params.itemId },
                include: { cart: true },
            })

            if (!item || item.cart.userId !== req.user!.id) {
                throw new AppError(404, 'Cart item not found')
            }

            await prisma.cartItem.delete({ where: { id: item.id } })
            sendSuccess(res, { message: 'Item removed' })
        } catch (err) { next(err) }
    }

    /** Clear cart */
    async clearCart(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const cart = await prisma.cart.findUnique({ where: { userId: req.user!.id } })
            if (cart) {
                await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })
            }
            sendSuccess(res, { message: 'Cart cleared' })
        } catch (err) { next(err) }
    }
}

export const cartController = new CartController()
