'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
    const { items, fetchCart, updateQuantity, removeItem, clearCart, isLoading } = useCartStore()
    const subtotal = useCartStore((s) => s.subtotal())
    const shipping = subtotal >= 800000 ? 0 : 15000

    useEffect(() => { fetchCart() }, [])

    if (!isLoading && items.length === 0) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <ShoppingBag className="w-20 h-20 text-gray-200 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-6">Start shopping to add items to your cart</p>
                    <Link href="/products" className="btn-primary">Browse Products</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-primary mb-8">Shopping Cart</h1>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Items list */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => {
                        const price = item.variant?.price ?? item.product.price
                        return (
                            <div key={item.id} className="card p-5 flex gap-5">
                                {/* Product image */}
                                <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                                    {item.product.images?.[0]?.url ? (
                                        <img
                                            src={item.product.images[0].url}
                                            alt={item.product.name}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <span className="text-3xl">🖨️</span>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <Link
                                        href={`/products/${item.product.slug}`}
                                        className="font-semibold text-gray-900 hover:text-accent transition-colors line-clamp-1"
                                    >
                                        {item.product.name}
                                    </Link>
                                    {item.variant && (
                                        <p className="text-xs text-gray-500 mt-0.5">Variant: {item.variant.name}</p>
                                    )}
                                    <p className="text-lg font-bold text-primary mt-2">{formatPrice(price)}</p>
                                </div>

                                <div className="flex flex-col items-end justify-between">
                                    {/* Remove button */}
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                                        title="Remove item"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                    {/* Line total */}
                                    <p className="text-sm font-bold text-gray-900 mb-1">
                                        {formatPrice(price * item.quantity)}
                                    </p>

                                    {/* Quantity controls */}
                                    <div className="flex items-center border border-gray-200 rounded-lg">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="p-2 hover:bg-gray-50 rounded-l-lg transition-colors"
                                            title="Decrease quantity"
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="p-2 hover:bg-gray-50 rounded-r-lg transition-colors"
                                            title="Increase quantity"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    {items.length > 0 && (
                        <button
                            onClick={clearCart}
                            className="text-sm text-red-500 hover:text-red-700 hover:underline transition-colors mt-2"
                        >
                            🗑️ Clear entire cart
                        </button>
                    )}
                </div>

                {/* Order Summary */}
                <div className="card p-6 h-fit sticky top-24">
                    <h2 className="text-lg font-bold text-primary mb-4">Order Summary</h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Items ({items.reduce((s, i) => s + i.quantity, 0)})</span>
                            <span className="font-medium">{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Shipping</span>
                            <span className="font-medium">
                                {shipping === 0
                                    ? <span className="text-green-600">Free</span>
                                    : formatPrice(shipping)
                                }
                            </span>
                        </div>
                        {shipping > 0 && (
                            <p className="text-xs text-gray-400">
                                Free shipping on orders over {formatPrice(800000)}
                            </p>
                        )}
                        <div className="border-t border-gray-100 pt-3 flex justify-between">
                            <span className="font-bold text-primary">Total</span>
                            <span className="font-bold text-xl text-primary">{formatPrice(subtotal + shipping)}</span>
                        </div>
                    </div>
                    <Link
                        href="/checkout"
                        className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
                    >
                        Proceed to Checkout <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                        href="/products"
                        className="block text-center text-sm text-gray-500 hover:text-accent mt-3 transition-colors"
                    >
                        ← Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    )
}
