'use client'

import { useEffect, useState, Suspense, useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Search, ShoppingCart } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'
import api from '@/lib/api'

const FALLBACK_GALLERY = [
    'https://images.unsplash.com/photo-1562408590-e32931084e23?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1612198273689-c5b3c9d2d46e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1617396900799-f4ec2b43c7ae?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=800&auto=format&fit=crop&q=80',
]

function isPlaceholder(url: string) {
    return url.includes('placehold') || url.includes('placeholder') || url.includes('via.placeholder')
}

function ProductImage({ product, index }: { product: Product; index: number }) {
    const [error, setError] = useState(false)
    const img = product.images?.[0]
    const useFallback = !img || isPlaceholder(img.url) || error
    const src = useFallback ? FALLBACK_GALLERY[index % FALLBACK_GALLERY.length] : img.url

    return (
        <Image
            src={src}
            alt={img?.alt || product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setError(true)}
        />
    )
}

// Custom Star SVG without using default emoji/icons
const StarIcon = ({ filled }: { filled: boolean }) => (
    <svg viewBox="0 0 24 24" fill={filled ? '#F97316' : 'none'} stroke={filled ? '#F97316' : '#1E3A5F'} strokeWidth="1.5" className="w-3 h-3 block shrink-0">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
)

function ProductsContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()

    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('')
    const [sort, setSort] = useState('newest')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    // Sync state with URL params
    useEffect(() => {
        const cat = searchParams.get('category') || ''
        const q = searchParams.get('search') || ''
        const s = searchParams.get('sort') || 'newest'
        const p = parseInt(searchParams.get('page') || '1')

        setCategory(cat)
        setSearch(q)
        setSort(s)
        setPage(p)
    }, [searchParams])

    const fetchProducts = useCallback(async () => {
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
    }, [search, category, sort, page])

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    const updateParams = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString())
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === '') {
                params.delete(key)
            } else {
                params.set(key, value)
            }
        })
        router.push(`${pathname}?${params.toString()}`)
    }

    const categories = [
        { label: 'ALL INVENTORY', value: '' },
        { label: 'FDM SYSTEMS', value: 'fdm-printers' },
        { label: 'RESIN MACHINES', value: 'resin-printers' },
        { label: 'MATERIALS', value: 'filaments' },
        { label: 'HARDWARE', value: 'accessories' },
    ]

    return (
        <div className="min-h-screen bg-canvas">
            {/* Header */}
            <div className="bg-navy-dark border-b-[8px] border-orange">
                <div className="max-w-7xl mx-auto px-4 py-16">
                    <h1 className="text-display-lg font-display font-[900] text-white tracking-tight uppercase leading-none">
                        SYSTEM <span className="text-orange">CATALOG</span>
                    </h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Filters bar */}
                <div className="flex flex-wrap items-center gap-4 mb-12 border-b-2 border-navy/10 pb-4">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px] max-w-md">
                        <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-navy" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => updateParams({ search: e.target.value, page: '1' })}
                            placeholder="SEARCH CATALOG..."
                            className="w-full bg-transparent border-b-2 border-navy pl-8 py-2 text-sm font-bold uppercase tracking-wider text-navy focus:outline-none focus:border-orange transition-colors rounded-none"
                        />
                    </div>

                    {/* Category tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide flex-1">
                        {categories.map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => updateParams({ category: cat.value, page: '1' })}
                                className={`px-4 py-2 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all border-2 rounded-none ${
                                    category === cat.value
                                        ? 'bg-navy text-white border-navy shadow-hard'
                                        : 'bg-transparent text-navy border-navy hover:bg-navy/5'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Sort */}
                    <select
                        value={sort}
                        onChange={(e) => updateParams({ sort: e.target.value })}
                        className="bg-transparent border-2 border-navy text-navy px-4 py-2 text-xs font-bold uppercase tracking-widest focus:outline-none hover:bg-navy/5 transition-colors rounded-none outline-none appearance-none cursor-pointer"
                        style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%231E3A5F%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7em top 50%', backgroundSize: '.65em auto', paddingRight: '2.5em' }}
                    >
                        <option value="newest">LATEST DEPLOYMENTS</option>
                        <option value="price_asc">PRICE: LOW TO HIGH</option>
                        <option value="price_desc">PRICE: HIGH TO LOW</option>
                        <option value="name">ALPHABETICAL</option>
                    </select>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="aspect-square bg-navy/5 animate-pulse border border-navy/10 relative overflow-hidden">
                                <div className="absolute bottom-0 w-full h-[40%] bg-navy/10" />
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-32 border-4 border-dashed border-navy/20">
                        <div className="text-6xl mb-6 opacity-30">⚠</div>
                        <h3 className="font-display font-[900] text-4xl text-navy uppercase mb-2">NO SIGNALS FOUND</h3>
                        <p className="font-mono text-sm text-navy/60 mb-8 uppercase tracking-widest">Adjust scanning parameters</p>
                        <button onClick={() => updateParams({ search: null, category: null, page: '1' })} className="btn-primary">
                            RESET FILTERS
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product, index) => (
                            <Link key={product.id} href={`/products/${product.slug}`} className="group relative block aspect-square bg-navy overflow-hidden">
                                {/* Image layer */}
                                <ProductImage product={product} index={index} />

                                {/* Badges */}
                                {product.comparePrice && product.comparePrice > product.price && (
                                    <div className="absolute top-0 right-0 bg-orange text-white text-xs font-bold px-3 py-1 font-mono tracking-widest z-20">
                                        -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                                    </div>
                                )}
                                {product.featured && (
                                    <div className="absolute top-0 left-0 bg-navy text-white text-xs font-bold px-3 py-1 font-mono tracking-widest z-20">
                                        PRIORITY
                                    </div>
                                )}

                                {/* Dark overlay sliding up */}
                                <div className="absolute bottom-0 left-0 w-full h-[50%] bg-[rgba(13,27,46,0.85)] flex flex-col justify-end p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-10 backdrop-blur-sm border-t border-white/10">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            {product.brand && (
                                                <div className="font-mono text-[10px] text-orange uppercase tracking-widest mb-1.5 opacity-90">
                                                    {product.brand.name}
                                                </div>
                                            )}
                                            <h3 className="font-display font-bold text-3xl text-white uppercase leading-none mb-3">
                                                {product.name}
                                            </h3>
                                            
                                            <div className="flex items-center gap-3">
                                                {/* Price */}
                                                <div className="font-mono text-xl font-bold text-orange flex items-baseline gap-2">
                                                    {formatPrice(product.price)}
                                                    {product.comparePrice && product.comparePrice > product.price && (
                                                        <span className="text-sm text-white/30 line-through">{formatPrice(product.comparePrice)}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action */}
                                        <div className="w-12 h-12 bg-orange flex items-center justify-center rounded-sm shrink-0 shadow-orange group-hover:scale-110 transition-transform">
                                            <ShoppingCart className="w-5 h-5 text-white" />
                                        </div>
                                    </div>

                                    {/* Footer details */}
                                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            {/* Status Dot */}
                                            {product.stock > 5 ? (
                                                <><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /><span className="font-mono text-[10px] text-white/50 tracking-widest uppercase">READY</span></>
                                            ) : product.stock > 0 ? (
                                                <><div className="w-2 h-2 bg-yellow-500 rounded-full" /><span className="font-mono text-[10px] text-white/50 tracking-widest uppercase">CRITICAL STOCK</span></>
                                            ) : (
                                                <><div className="w-2 h-2 bg-red-500 rounded-full" /><span className="font-mono text-[10px] text-white/50 tracking-widest uppercase">DEPLETED</span></>
                                            )}
                                        </div>
                                        
                                        {/* Stars */}
                                        <div className="flex items-center gap-0.5">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <StarIcon key={i} filled={i < (product.averageRating || 4)} />
                                            ))}
                                            <span className="font-mono text-[10px] text-white/40 ml-2">({product._count?.reviews || 0})</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-16 pb-16">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => updateParams({ page: String(i + 1) })}
                                className={`w-12 h-12 text-sm font-bold transition-all border-2 rounded-none font-mono tracking-widest ${
                                    page === i + 1
                                        ? 'bg-navy text-white border-navy'
                                        : 'bg-transparent text-navy border-[rgba(30,58,95,0.2)] hover:border-navy hover:bg-navy/5'
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

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-canvas flex items-center justify-center font-display text-2xl text-navy animate-pulse uppercase tracking-[0.2em]">Synchronizing Systems...</div>}>
            <ProductsContent />
        </Suspense>
    )
}
