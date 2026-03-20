'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, SlidersHorizontal, Grid3X3, List, Star } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'
import api from '@/lib/api'

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('')
    const [sort, setSort] = useState('newest')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [filtersOpen, setFiltersOpen] = useState(false)

    useEffect(() => {
        // Read URL params on mount
        const params = new URLSearchParams(window.location.search)
        if (params.get('category')) setCategory(params.get('category')!)
        if (params.get('search')) setSearch(params.get('search')!)
        if (params.get('featured')) setSort('featured')
    }, [])

    useEffect(() => {
        fetchProducts()
    }, [search, category, sort, page])

    async function fetchProducts() {
        try {
            setLoading(true)
            const params: Record<string, string> = { page: String(page), limit: '12', sort }
            if (search) params.search = search
            if (category) params.category = category
            if (sort === 'featured') params.featured = 'true'

            const { data } = await api.get('/products', { params })
            if (data.success) {
                setProducts(data.data)
                setTotalPages(data.meta?.pagination?.totalPages || 1)
            }
        } catch {
            setProducts([])
        } finally {
            setLoading(false)
        }
    }

    const categories = [
        { label: 'All', value: '' },
        { label: 'FDM Printers', value: 'fdm-printers' },
        { label: 'Resin Printers', value: 'resin-printers' },
        { label: 'Filaments', value: 'filaments' },
        { label: 'Accessories', value: 'accessories' },
    ]

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-primary mb-2">Products</h1>
                    <p className="text-gray-500">Browse our collection of 3D printers, filaments, and accessories</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Filters bar */}
                <div className="flex flex-wrap items-center gap-3 mb-8">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px] max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                            placeholder="Search products..."
                            className="input-field pl-10 text-sm"
                        />
                    </div>

                    {/* Category tabs */}
                    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl overflow-x-auto">
                        {categories.map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => { setCategory(cat.value); setPage(1) }}
                                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${category === cat.value
                                        ? 'bg-white text-primary shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Sort */}
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="input-field w-auto text-sm"
                    >
                        <option value="newest">Newest</option>
                        <option value="price_asc">Price: Low → High</option>
                        <option value="price_desc">Price: High → Low</option>
                        <option value="name">Name A–Z</option>
                    </select>

                    {/* View toggle */}
                    <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                        >
                            <Grid3X3 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'} gap-6`}>
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="card p-4 animate-pulse">
                                <div className="aspect-square bg-gray-200 rounded-xl mb-4" />
                                <div className="h-4 bg-gray-200 rounded mb-2" />
                                <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
                                <div className="h-6 bg-gray-200 rounded w-1/3" />
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
                        <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
                        <button onClick={() => { setSearch(''); setCategory('') }} className="btn-primary">
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'} gap-6`}>
                        {products.map((product) => (
                            <Link key={product.id} href={`/products/${product.slug}`} className="card-hover group overflow-hidden">
                                {/* Image */}
                                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                                    {product.images && product.images.length > 0 ? (
                                        <Image
                                            src={product.images[0].url}
                                            alt={product.images[0].alt || product.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-6xl text-gray-300">
                                            🖨️
                                        </div>
                                    )}
                                    {product.comparePrice && product.comparePrice > product.price && (
                                        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg z-10">
                                            -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                                        </span>
                                    )}
                                    {product.featured && (
                                        <span className="absolute top-3 right-3 bg-accent text-white text-xs font-bold px-2 py-1 rounded-lg z-10">
                                            Featured
                                        </span>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="p-4">
                                    {product.brand && (
                                        <span className="text-xs font-medium text-accent">{product.brand.name}</span>
                                    )}
                                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-accent transition-colors mt-0.5 mb-2">
                                        {product.name}
                                    </h3>

                                    {/* Rating */}
                                    <div className="flex items-center gap-1 mb-2">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} className={`w-3 h-3 ${i < (product.averageRating || 4) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                                        ))}
                                        <span className="text-xs text-gray-400 ml-1">({product._count?.reviews || 0})</span>
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
                                        {product.comparePrice && product.comparePrice > product.price && (
                                            <span className="text-sm text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>
                                        )}
                                    </div>

                                    {/* Stock */}
                                    <div className="mt-2">
                                        {product.stock > 5 ? (
                                            <span className="badge-success">In Stock</span>
                                        ) : product.stock > 0 ? (
                                            <span className="badge bg-yellow-100 text-yellow-700">Low Stock</span>
                                        ) : (
                                            <span className="badge-danger">Out of Stock</span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-10">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i + 1)}
                                className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${page === i + 1
                                        ? 'bg-primary text-white shadow-lg'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
