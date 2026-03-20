'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Star, Minus, Plus, ShoppingCart, Heart, Truck, Shield, RotateCcw, ChevronRight, Check } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import type { Product } from '@/types'
import api from '@/lib/api'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
    const params = useParams()
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [quantity, setQuantity] = useState(1)
    const [activeTab, setActiveTab] = useState('description')
    const addItem = useCartStore((s) => s.addItem)

    useEffect(() => {
        fetchProduct()
    }, [params.slug])

    async function fetchProduct() {
        try {
            setLoading(true)
            const { data } = await api.get(`/products/${params.slug}`)
            if (data.success) setProduct(data.data)
        } catch {
            //
        } finally {
            setLoading(false)
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
                    {/* Image */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-gray-100 rounded-3xl flex items-center justify-center relative overflow-hidden">
                            <div className="text-[120px]">🖨️</div>
                            {product.comparePrice && product.comparePrice > product.price && (
                                <span className="absolute top-4 left-4 bg-red-500 text-white font-bold px-3 py-1.5 rounded-xl text-sm">
                                    SAVE {formatPrice(product.comparePrice - product.price)}
                                </span>
                            )}
                        </div>
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

                        {/* Specs highlights */}
                        {product.specs && (
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {Object.entries(product.specs).slice(0, 6).map(([key, value]) => (
                                    <div key={key} className="bg-gray-50 rounded-xl p-3">
                                        <div className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                                        <div className="text-sm font-semibold text-gray-900">{String(value)}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Shipping info */}
                        <div className="border border-gray-100 rounded-2xl p-4 space-y-3">
                            {[
                                { icon: <Truck className="w-4 h-4 text-accent" />, text: 'Free shipping on orders over MMK 500' },
                                { icon: <Shield className="w-4 h-4 text-accent" />, text: '1-year manufacturer warranty' },
                                { icon: <RotateCcw className="w-4 h-4 text-accent" />, text: '14-day return policy' },
                            ].map((info) => (
                                <div key={info.text} className="flex items-center gap-3 text-sm text-gray-600">
                                    {info.icon}
                                    {info.text}
                                </div>
                            ))}
                        </div>
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
            </div>
        </div>
    )
}
