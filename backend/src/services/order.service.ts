import prisma from '../config/database'
import { AppError } from '../utils/apiResponse'
import { env } from '../config/env'
import { CreateOrderInput } from '../schemas/order.schema'

export class OrderService {
    /** Create order from user's cart */
    async createOrder(userId: string, data: CreateOrderInput) {
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: { select: { id: true, name: true, price: true, stock: true } },
                        variant: { select: { id: true, name: true, price: true, stock: true } },
                    },
                },
            },
        })

        if (!cart || cart.items.length === 0) {
            throw new AppError(400, 'Cart is empty')
        }

        // Validate stock
        for (const item of cart.items) {
            const stock = item.variant?.stock ?? item.product.stock
            if (item.quantity > stock) {
                throw new AppError(400, `Insufficient stock for ${item.product.name}`)
            }
        }

        // Calculate totals
        let subtotal = 0
        const orderItems = cart.items.map((item) => {
            const price = item.variant?.price ?? item.product.price
            const total = price * item.quantity
            subtotal += total
            return {
                productId: item.productId,
                variantId: item.variantId,
                quantity: item.quantity,
                price,
                total,
            }
        })

        // Apply coupon
        let discount = 0
        let couponId: string | undefined
        if (data.couponCode) {
            const coupon = await prisma.coupon.findUnique({ where: { code: data.couponCode } })
            if (!coupon || !coupon.active) throw new AppError(400, 'Invalid coupon code')
            if (coupon.expiresAt && coupon.expiresAt < new Date()) throw new AppError(400, 'Coupon expired')
            if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) throw new AppError(400, 'Coupon usage limit reached')
            if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) throw new AppError(400, `Minimum order amount: MYR ${coupon.minOrderAmount}`)

            if (coupon.discountPercent) discount = subtotal * (coupon.discountPercent / 100)
            else if (coupon.discountAmount) discount = coupon.discountAmount
            couponId = coupon.id
        }

        // Shipping
        const shippingCost = data.shippingMethod === 'express'
            ? env.EXPRESS_SHIPPING_COST
            : subtotal >= env.FREE_SHIPPING_THRESHOLD ? 0 : env.DEFAULT_SHIPPING_COST

        const total = subtotal - discount + shippingCost

        // Handle address
        let finalAddressId = data.addressId
        if (data.address && !finalAddressId) {
            const newAddress = await prisma.address.create({
                data: { ...data.address, userId }
            })
            finalAddressId = newAddress.id
        }

        if (!finalAddressId) throw new AppError(400, 'Address is required')

        // Create order in transaction
        const order = await prisma.$transaction(async (tx) => {
            const ord = await tx.order.create({
                data: {
                    orderNumber: `TRX-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
                    userId,
                    addressId: finalAddressId as string,
                    subtotal,
                    discount,
                    shippingCost,
                    tax: 0,
                    total,
                    notes: data.notes,
                    couponId,
                    items: { create: orderItems },
                },
                include: { items: true },
            })

            // Decrement stock
            for (const item of cart.items) {
                if (item.variantId) {
                    await tx.productVariant.update({
                        where: { id: item.variantId },
                        data: { stock: { decrement: item.quantity } },
                    })
                } else {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: { stock: { decrement: item.quantity } },
                    })
                }
            }

            // Increment coupon usage
            if (couponId) {
                await tx.coupon.update({
                    where: { id: couponId },
                    data: { usedCount: { increment: 1 } },
                })
            }

            // Clear cart
            await tx.cartItem.deleteMany({ where: { cartId: cart.id } })

            return ord
        })

        return order
    }

    /** Get orders for a specific user */
    async getUserOrders(userId: string, page = 1, limit = 10) {
        const skip = (page - 1) * limit
        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where: { userId },
                include: {
                    items: {
                        include: {
                            product: { select: { id: true, name: true, slug: true, images: { take: 1 } } },
                        },
                    },
                    address: true,
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.order.count({ where: { userId } }),
        ])

        return { orders, total, page, limit, totalPages: Math.ceil(total / limit) }
    }

    /** Get single order by ID (with ownership check) */
    async getOrderById(orderId: string, userId: string, isAdmin = false) {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: {
                        product: { select: { id: true, name: true, slug: true, images: { take: 1 } } },
                        variant: { select: { id: true, name: true } },
                    },
                },
                address: true,
                user: { select: { id: true, name: true, email: true } },
            },
        })

        if (!order) throw new AppError(404, 'Order not found')
        if (!isAdmin && order.userId !== userId) throw new AppError(403, 'Forbidden')

        return order
    }

    /** Admin: Get all orders */
    async getAllOrders(page = 1, limit = 20) {
        const skip = (page - 1) * limit
        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                include: {
                    user: { select: { id: true, name: true, email: true } },
                    address: true,
                    items: { include: { product: { select: { name: true } } } },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.order.count(),
        ])
        return { orders, total, page, limit, totalPages: Math.ceil(total / limit) }
    }

    /** Public: Track order by number */
    async trackOrder(orderNumber: string) {
        const order = await prisma.order.findUnique({
            where: { orderNumber },
            include: {
                address: { select: { city: true, state: true, country: true } },
                items: {
                    include: {
                        product: { select: { name: true, images: { take: 1 } } }
                    }
                }
            }
        })

        if (!order) throw new AppError(404, 'Order not found')

        // Return limited info for public tracking
        return {
            orderNumber: order.orderNumber,
            status: order.status,
            trackingNumber: order.trackingNumber,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            items: order.items,
            location: order.address ? `${order.address.city}, ${order.address.state}` : 'N/A'
        }
    }

    /** Admin: Update order status */
    async updateStatus(orderId: string, status: string, trackingNumber?: string) {
        return prisma.order.update({
            where: { id: orderId },
            data: { status: status as any, trackingNumber },
        })
    }

    /** Cancel an order (user) */
    async cancelOrder(orderId: string, userId: string) {
        const order = await prisma.order.findUnique({ where: { id: orderId } })
        if (!order) throw new AppError(404, 'Order not found')
        if (order.userId !== userId) throw new AppError(403, 'Forbidden')
        if (!['PENDING', 'PROCESSING'].includes(order.status)) {
            throw new AppError(400, 'Cannot cancel order in current status')
        }

        return prisma.order.update({
            where: { id: orderId },
            data: { status: 'CANCELLED' },
        })
    }
}

export const orderService = new OrderService()
