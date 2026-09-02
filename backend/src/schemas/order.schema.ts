import { z } from 'zod'

export const createOrderSchema = z.object({
    addressId: z.string().optional(),
    address: z.object({
        fullName: z.string().min(2),
        phone: z.string().min(5),
        street: z.string().min(5),
        city: z.string().min(2),
        state: z.string().min(2),
        postalCode: z.string().min(3),
        country: z.string().default('Malaysia'),
    }).optional(),
    couponCode: z.string().optional(),
    notes: z.string().optional(),
    shippingMethod: z.enum(['standard', 'express']).default('standard'),
}).refine(data => data.addressId || data.address, {
    message: "Either addressId or a new address must be provided",
    path: ["address"]
})

export const trackOrderSchema = z.object({
    orderNumber: z.string().min(5, 'Order number is required'),
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
