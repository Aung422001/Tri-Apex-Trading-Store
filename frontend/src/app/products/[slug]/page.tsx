'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Star, Minus, Plus, ShoppingCart, Heart, Truck, Shield, RotateCcw, ChevronRight, Check, TrendingDown, ExternalLink, Loader2, ChevronLeft } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import type { Product } from '@/types'
import api from '@/lib/api'
import toast from 'react-hot-toast'

const FALLBACK_GALLERY: { url: string; alt: string }[] = [
    {
        url: 'https://images.unsplash.com/photo-1562408590-e32931084e23?w=800&auto=format&fit=crop&q=80',
        alt: '3D printer in operation',
    },
    {
        url: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800&auto=format&fit=crop&q=80',
        alt: '3D printing in progress',
    },
    {
        url: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=800&auto=format&fit=crop&q=80',
        alt: '3D printer close-up',
    },
    {
        url: 'https://images.unsplash.com/photo-1612198273689-c5b3c9d2d46e?w=800&auto=format&fit=crop&q=80',
        alt: '3D printing material',
    },
]

export default function ProductDetailPage() {
    const params = useParams()
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [quantity, setQuantity] = useState(1)
    const [activeTab, setActiveTab] = useState('description')
    const addItem = useCartStore((s) => s.addItem)

    // Gallery state
    const [selectedImg, setSelectedImg] = useState(0)
    const [imgError, setImgError] = useState(false)

    // Related products state
    const [related, setRelated] = useState<Product[]>([])

    // Price comparison state
    const [priceCompareLoading, setPriceCompareLoading] = useState(false)
    const [priceCompareResult, setPriceCompareResult] = useState<any>(null)
    const [showPriceCompare, setShowPriceCompare] = useState(false)

    useEffect(() => {
        fetchProduct()
    }, [params.slug])

    async function fetchProduct() {
        try {
            setLoading(true)
            const { data } = await api.get(`/products/${params.slug}`)
            if (data.success) {
                setProduct(data.data)
                setSelectedImg(0)
                setImgError(false)
                fetchRelated(data.data)
            }
        } catch {
            //
        } finally {
            setLoading(false)
        }
    }

    async function fetchRelated(p: Product) {
        try {
            const params: Record<string, string> = { limit: '4' }
            if (p.category?.slug) params.category = p.category.slug
            const { data } = await api.get('/products', { params })
            if (data.success) {
                setRelated((data.data as Product[]).filter((r) => r.id !== p.id).slice(0, 4))
            }
        } catch {
            //
        }
    }

    async function handleAddToCart() {
        if (!product) return
        try {
            await addItem(product.id, quantity)
            toast.success('Added to cart!')
        } catch (err: any) {
            toast.error(err.message || 'Please login to add items to cart')
        }
    }

    async function handlePriceCompare() {
        if (!product) return
        setShowPriceCompare(true)
        setPriceCompareLoading(true)
        setPriceCompareResult(null)
        try {
            const { data } = await api.post('/ai/price-compare', {
                productName: product.name,
                ourPrice: product.price,
                currency: 'MMK',
            })
            if (data.success) setPriceCompareResult(data.data)
        } catch {
            setPriceCompareResult({ error: 'Could not fetch competitor prices. Please try again.' })
        } finally {
            setPriceCompareLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-2 gap-12">
                    <div className="aspect-square skeleton" />
                    <div className="space-y-4">
                        <div className="h-6 skeleton w-1/3" />
                        <div className="h-10 skeleton w-2/3" />
                        <div className="h-8 skeleton w-1/4" />
                        <div className="h-12 skeleton w-full" />
                    </div>
                </div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="text-center py-20">
                <div className="text-6xl mb-4">😕</div>
                <h2 className="text-2xl font-bold text-gray-700 mb-3">Product Not Found</h2>
                <Link href="/products" className="btn-primary">Back to Products</Link>
            </div>
        )
    }

    return (
        <div className="page-enter">
            {/* Breadcrumb */}
            <div className="bg-gray-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Link href="/" className="hover:text-accent">Home</Link>
                        <ChevronRight className="w-3 h-3" />
                        <Link href="/products" className="hover:text-accent">Products</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-gray-900 font-medium truncate">{product.name}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-10">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        {(() => {
                            const gallery = product.images.length > 0
                                ? product.images.map((img) => ({ url: img.url, alt: img.alt || product.name }))
                                : FALLBACK_GALLERY
                            const current = gallery[selectedImg] ?? gallery[0]
                            return (
                                <>
                                    {/* Main image */}
                                    <div className="aspect-square bg-gray-100 rounded-3xl relative overflow-hidden group">
                                        {!imgError ? (
                                            <Image
                                                src={current.url}
                                                alt={current.alt}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                sizes="(max-width: 1024px) 100vw, 50vw"
                                                onError={() => setImgError(true)}
                                                priority
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[120px]">🖨️</div>
                                        )}

                                        {/* Sale badge */}
                                        {product.comparePrice && product.comparePrice > product.price && (
                                            <span className="absolute top-4 left-4 bg-red-500 text-white font-bold px-3 py-1.5 rounded-xl text-sm z-10">
                                                SAVE {formatPrice(product.comparePrice - product.price)}
                                            </span>
                                        )}

                                        {/* Prev/Next arrows */}
                                        {gallery.length > 1 && (
                                            <>
                                                <button
                                                    onClick={() => { setSelectedImg((selectedImg - 1 + gallery.length) % gallery.length); setImgError(false) }}
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <ChevronLeft className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => { setSelectedImg((selectedImg + 1) % gallery.length); setImgError(false) }}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </>
                                        )}
                                    </div>

                                    {/* Thumbnails */}
                                    {gallery.length > 1 && (
                                        <div className="flex gap-3 overflow-x-auto pb-1">
                                            {gallery.map((img, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => { setSelectedImg(i); setImgError(false) }}
                                                    className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                                                        selectedImg === i ? 'border-accent shadow-md' : 'border-transparent hover:border-gray-300'
                                                    }`}
                                                >
                                                    <Image
                                                        src={img.url}
                                                        alt={img.alt}
                                                        fill
                                                        className="object-cover"
                                                        sizes="80px"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )
                        })()}
                    </div>

                    {/* Product Info */}
                    <div>
                        {product.brand && (
                            <span className="badge-accent text-sm mb-2 inline-block">{product.brand.name}</span>
                        )}
                        <h1 className="text-3xl font-bold text-primary mb-3">{product.name}</h1>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className={`w-5 h-5 ${i < (product.averageRating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                                ))}
                            </div>
                            <span className="text-sm text-gray-500">({product._count?.reviews || 0} reviews)</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-3 mb-6">
                            <span className="text-4xl font-bold text-primary">{formatPrice(product.price)}</span>
                            {product.comparePrice && product.comparePrice > product.price && (
                                <span className="text-xl text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>
                            )}
                        </div>

                        {/* Short description */}
                        {product.shortDescription && (
                            <p className="text-gray-600 mb-6 leading-relaxed">{product.shortDescription}</p>
                        )}

                        {/* Stock */}
                        <div className="mb-6">
                            {product.stock > 5 ? (
                                <span className="badge-success text-sm"><Check className="w-3 h-3 mr-1" /> In Stock ({product.stock} available)</span>
                            ) : product.stock > 0 ? (
                                <span className="badge bg-yellow-100 text-yellow-700 text-sm">⚠️ Low Stock — Only {product.stock} left</span>
                            ) : (
                                <span className="badge-danger text-sm">Out of Stock</span>
                            )}
                        </div>

                        {/* Quantity + Add to cart */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-3 hover:bg-gray-50 transition-colors"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-12 text-center font-semibold">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    className="p-3 hover:bg-gray-50 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Add to Cart
                            </button>

                            <button className="p-3 border border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-200 transition-colors group">
                                <Heart className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                            </button>
                        </div>



                        {/* Shipping info */}
                        <div className="border border-gray-100 rounded-2xl p-4 space-y-3">
                            {[
                                { icon: <Truck className="w-4 h-4 text-accent" />, text: 'Free shipping on orders over MMK 800,000' },
                                { icon: <Shield className="w-4 h-4 text-accent" />, text: '1-year manufacturer warranty' },
                                { icon: <RotateCcw className="w-4 h-4 text-accent" />, text: '14-day return policy' },
                            ].map((info) => (
                                <div key={info.text} className="flex items-center gap-3 text-sm text-gray-600">
                                    {info.icon}
                                    {info.text}
                                </div>
                            ))}
                        </div>

                        {/* Price Compare Button */}
                        <div className="mt-4">
                            <button
                                onClick={handlePriceCompare}
                                disabled={priceCompareLoading}
                                className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-accent/40 rounded-2xl text-accent font-semibold hover:bg-accent/5 hover:border-accent transition-all duration-200 disabled:opacity-60"
                            >
                                {priceCompareLoading
                                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Searching competitors...</>
                                    : <><TrendingDown className="w-4 h-4" /> Compare Prices Online</>}
                            </button>
                        </div>

                        {/* Price Comparison Results */}
                        {showPriceCompare && (
                            <div className="mt-4 bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-4 animate-fade-in">
                                <div className="flex items-center gap-2">
                                    <TrendingDown className="w-5 h-5 text-accent" />
                                    <h3 className="font-bold text-gray-800">Price Comparison</h3>
                                </div>

                                {priceCompareLoading && (
                                    <div className="text-sm text-gray-500 flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Fetching live prices from competitors...
                                    </div>
                                )}

                                {priceCompareResult?.error && (
                                    <p className="text-sm text-red-500">{priceCompareResult.error}</p>
                                )}

                                {priceCompareResult && !priceCompareResult.error && (
                                    <>
                                        {/* Our Price */}
                                        <div className="flex items-center justify-between bg-accent/10 rounded-xl px-4 py-3">
                                            <span className="font-semibold text-gray-800">🏆 Triapex Trading</span>
                                            <span className="text-accent font-bold">
                                                MMK {Number(priceCompareResult.ourPrice).toLocaleString()}
                                            </span>
                                        </div>

                                        {/* Competitor Prices */}
                                        {priceCompareResult.competitors?.map((c: any) => (
                                            <div key={c.site} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-gray-100">
                                                <div>
                                                    <span className="font-medium text-gray-700">{c.site}</span>
                                                    {c.note && <p className="text-xs text-gray-400 mt-0.5">{c.note}</p>}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {c.available && c.price
                                                        ? <span className="font-semibold text-gray-900">{c.price}</span>
                                                        : <span className="text-xs text-gray-400 italic">Unavailable</span>
                                                    }
                                                    {c.available && (
                                                        <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-600">
                                                            <ExternalLink className="w-3.5 h-3.5" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}

                                        {/* AI Summary */}
                                        {priceCompareResult.aiSummary && (
                                            <p className="text-xs text-gray-500 leading-relaxed border-t border-gray-200 pt-3">
                                                💡 {priceCompareResult.aiSummary}
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="mt-16">
                    <div className="flex gap-1 border-b border-gray-200 mb-8">
                        {[
                            { id: 'description', label: 'Description' },
                            { id: 'specs', label: 'Specifications' },
                            { id: 'reviews', label: `Reviews (${product._count?.reviews || 0})` },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                    ? 'border-accent text-accent'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="max-w-3xl">
                        {activeTab === 'description' && product.description && (
                            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />
                        )}
                        {activeTab === 'specs' && product.specs && (
                            <div className="grid gap-2">
                                {Object.entries(product.specs).map(([key, value]) => (
                                    <div key={key} className="flex items-center py-3 px-4 rounded-xl even:bg-gray-50">
                                        <span className="w-1/3 text-sm text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                        <span className="flex-1 text-sm font-medium text-gray-900">{String(value)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {activeTab === 'reviews' && (
                            <div>
                                {product.reviews && product.reviews.length > 0 ? (
                                    <div className="space-y-4">
                                        {product.reviews.map((review) => (
                                            <div key={review.id} className="card p-5">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                        {review.user.name[0]}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-sm">{review.user.name}</div>
                                                        <div className="flex items-center gap-1">
                                                            {Array.from({ length: 5 }).map((_, i) => (
                                                                <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                {review.title && <p className="font-semibold text-sm mb-1">{review.title}</p>}
                                                {review.comment && <p className="text-sm text-gray-600">{review.comment}</p>}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 text-gray-400">
                                        <Star className="w-12 h-12 mx-auto mb-3" />
                                        <p>No reviews yet.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {related.length > 0 && (
                    <div className="mt-20">
                        <h2 className="text-2xl font-bold text-primary mb-8">Related Products</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {related.map((r) => {
                                const img = r.images?.[0]
                                const fallback = FALLBACK_GALLERY[0]
                                return (
                                    <Link
                                        key={r.id}
                                        href={`/products/${r.slug}`}
                                        className="group card overflow-hidden hover:shadow-lg transition-shadow"
                                    >
                                        <div className="aspect-square relative bg-gray-100 overflow-hidden">
                                            <Image
                                                src={img?.url ?? fallback.url}
                                                alt={img?.alt ?? r.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                sizes="(max-width: 768px) 50vw, 25vw"
                                            />
                                        </div>
                                        <div className="p-4">
                                            {r.brand && (
                                                <p className="text-xs text-accent font-semibold mb-1 uppercase tracking-wide">{r.brand.name}</p>
                                            )}
                                            <h3 className="text-sm font-semibold text-primary line-clamp-2 mb-2">{r.name}</h3>
                                            <p className="text-base font-bold text-primary">{formatPrice(r.price)}</p>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
