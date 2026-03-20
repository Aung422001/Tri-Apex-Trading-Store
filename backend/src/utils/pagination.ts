export interface PaginationParams {
    page: number
    limit: number
    skip: number
}

export interface PaginationMeta {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
}

/** Parse pagination from query params */
export function parsePagination(query: { page?: string; limit?: string }): PaginationParams {
    const page = Math.max(1, parseInt(query.page || '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || '12', 10)))
    const skip = (page - 1) * limit
    return { page, limit, skip }
}

/** Build pagination metadata */
export function buildPaginationMeta(page: number, limit: number, total: number): PaginationMeta {
    const totalPages = Math.ceil(total / limit)
    return {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
    }
}
