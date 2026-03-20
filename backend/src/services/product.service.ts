import prisma from '../config/database'
import { cacheGet, cacheInvalidate } from '../config/redis'
import { AppError } from '../utils/apiResponse'
import { parsePagination, buildPaginationMeta } from '../utils/pagination'
import { CreateProductInput, UpdateProductInput } from '../schemas/product.schema'
import { Prisma } from '@prisma/client'

export class ProductService {
    /** List products with filters, search, and pagination */
    async list(query: Record<string, string | undefined>) {
        const { page, limit, skip } = parsePagination(query)

        const where: Prisma.ProductWhereInput = { published: true }

        if (query.search) {
            where.OR = [
                { name: { contains: query.search } },
                { shortDescription: { contains: query.search } },
            ]
        }
        if (query.category) where.category = { slug: query.category }
        if (query.brand) where.brand = { slug: query.brand }
        if (query.printTechnology) where.printTechnology = query.printTechnology as any
        if (query.featured === 'true') where.featured = true
        if (query.minPrice || query.maxPrice) {
            where.price = {}
            if (query.minPrice) where.price.gte = parseFloat(query.minPrice)
            if (query.maxPrice) where.price.lte = parseFloat(query.maxPrice)
        }

        let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' }
        switch (query.sort) {
            case 'price_asc': orderBy = { price: 'asc' }; break
            case 'price_desc': orderBy = { price: 'desc' }; break
            case 'newest': orderBy = { createdAt: 'desc' }; break
            case 'name': orderBy = { name: 'asc' }; break
        }

        const cacheKey = `products:${JSON.stringify({ where, orderBy, skip, limit })}`

        return cacheGet(cacheKey, async () => {
            const [products, total] = await Promise.all([
                prisma.product.findMany({
                    where,
                    orderBy,
                    skip,
                    take: limit,
                    include: {
                        images: { orderBy: { position: 'asc' }, take: 1 },
                        category: { select: { id: true, name: true, slug: true } },
                        brand: { select: { id: true, name: true, slug: true } },
                        _count: { select: { reviews: true } },
                    },
                }),
                prisma.product.count({ where }),
            ])

            return { products, pagination: buildPaginationMeta(page, limit, total) }
        }, 300)
    }

    /** Get single product by slug with full details */
    async getBySlug(slug: string) {
        return cacheGet(`product:${slug}`, async () => {
            const product = await prisma.product.findUnique({
                where: { slug },
                include: {
                    images: { orderBy: { position: 'asc' } },
                    category: true,
                    brand: true,
                    variants: true,
                    reviews: {
                        include: { user: { select: { id: true, name: true, avatar: true } } },
                        orderBy: { createdAt: 'desc' },
                        take: 10,
                    },
                    _count: { select: { reviews: true } },
                },
            })
            if (!product) throw new AppError(404, 'Product not found')

            // Calculate average rating
            const avgRating = await prisma.review.aggregate({
                where: { productId: product.id },
                _avg: { rating: true },
            })

            return { ...product, averageRating: avgRating._avg.rating || 0 }
        }, 600)
    }

    /** Create a product (admin) */
    async create(data: CreateProductInput) {
        if (!data.slug) {
            data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        }

        const product = await prisma.product.create({
            data: data as any,
            include: { images: true, category: true, brand: true },
        })

        await cacheInvalidate('products:*')
        return product
    }

    /** Update a product (admin) */
    async update(id: string, data: UpdateProductInput) {
        const product = await prisma.product.update({
            where: { id },
            data: data as any,
            include: { images: true, category: true, brand: true },
        })

        await cacheInvalidate('products:*')
        await cacheInvalidate(`product:${product.slug}`)
        return product
    }

    /** Delete a product (admin) */
    async delete(id: string) {
        const product = await prisma.product.delete({ where: { id } })
        await cacheInvalidate('products:*')
        await cacheInvalidate(`product:${product.slug}`)
        return product
    }

    /** Get all categories */
    async getCategories() {
        return cacheGet('categories', () =>
            prisma.category.findMany({
                include: { _count: { select: { products: true } } },
                orderBy: { name: 'asc' },
            })
            , 3600)
    }

    /** Get all brands */
    async getBrands() {
        return cacheGet('brands', () =>
            prisma.brand.findMany({
                include: { _count: { select: { products: true } } },
                orderBy: { name: 'asc' },
            })
            , 3600)
    }
}

export const productService = new ProductService()
