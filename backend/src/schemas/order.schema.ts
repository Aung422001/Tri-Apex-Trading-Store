import { z } from 'zod'

export const createOrderSchema = z.object({
    addressId: z.string().min(1, 'Shipping address is required'),
    couponCode: z.string().optional(),
    notes: z.string().optional(),
    shippingMethod: z.enum(['standard', 'express']).default('standard'),
})

export const updateOrderStatusSchema = z.object({
    status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']),
    trackingNumber: z.string().optional(),
})

export const createAddressSchema = z.object({
    label: z.string().optional(),
    fullName: z.string().min(2),
    phone: z.string().min(5),
    street: z.string().min(5),
    city: z.string().min(2),
    state: z.string().min(2),
    postalCode: z.string().min(3),
    country: z.string().default('Malaysia'),
    isDefault: z.boolean().default(false),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>
export type CreateAddressInput = z.infer<typeof createAddressSchema>
