import { z } from 'zod'

export const createProductSchema = z.object({
    name: z.string().min(2),
    slug: z.string().min(2).optional(),
    shortDescription: z.string().optional(),
    description: z.string().optional(),
    price: z.number().positive(),
    comparePrice: z.number().positive().optional(),
    cost: z.number().positive().optional(),
    sku: z.string().optional(),
    stock: z.number().int().min(0).default(0),
    lowStockThreshold: z.number().int().min(0).default(5),
    weight: z.number().positive().optional(),
    featured: z.boolean().default(false),
    published: z.boolean().default(true),
    printTechnology: z.enum(['FDM', 'SLA', 'SLS', 'DLP', 'OTHER']).optional(),
    buildVolume: z.string().optional(),
    resolution: z.string().optional(),
    connectivity: z.string().optional(),
    specs: z.record(z.any()).optional(),
    categoryId: z.string().optional(),
    brandId: z.string().optional(),
})

export const updateProductSchema = createProductSchema.partial()

export const productQuerySchema = z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
    category: z.string().optional(),
    brand: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    printTechnology: z.string().optional(),
    featured: z.string().optional(),
    sort: z.enum(['price_asc', 'price_desc', 'newest', 'rating', 'name']).optional(),
})

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
