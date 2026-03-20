'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
    const { items, fetchCart, updateQuantity, removeItem, clearCart } = useCartStore()
    const subtotal = useCartStore((s) => s.subtotal())
    const shipping = subtotal >= 500 ? 0 : 15

    useEffect(() => { fetchCart() }, [])

    if (items.length === 0) {
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
                {/* Items */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => {
                        const price = item.variant?.price ?? item.product.price
                        return (
                            <div key={item.id} className="card p-5 flex gap-5">
                                <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">🖨️</div>
                                <div className="flex-1 min-w-0">
                                    <Link href={`/products/${item.product.slug}`} className="font-semibold text-gray-900 hover:text-accent transition-colors line-clamp-1">
                                        {item.product.name}
                                    </Link>
                                    {item.variant && <p className="text-xs text-gray-500 mt-0.5">Variant: {item.variant.name}</p>}
                                    <p className="text-lg font-bold text-primary mt-2">{formatPrice(price)}</p>
                                </div>
                                <div className="flex flex-col items-end justify-between">
                                    <button onClick={() => removeItem(item.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <div className="flex items-center border border-gray-200 rounded-lg">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-gray-50">
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-gray-50">
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    <button onClick={clearCart} className="text-sm text-red-500 hover:underline">Clear Cart</button>
                </div>

                {/* Summary */}
                <div className="card p-6 h-fit sticky top-24">
                    <h2 className="text-lg font-bold text-primary mb-4">Order Summary</h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-medium">{formatPrice(subtotal)}</span></div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Shipping</span>
                            <span className="font-medium">{shipping === 0 ? <span className="text-green-600">Free</span> : formatPrice(shipping)}</span>
                        </div>
                        {shipping > 0 && <p className="text-xs text-gray-400">Free shipping on orders over MMK 500</p>}
                        <div className="border-t border-gray-100 pt-3 flex justify-between">
                            <span className="font-bold text-primary">Total</span>
                            <span className="font-bold text-xl text-primary">{formatPrice(subtotal + shipping)}</span>
                        </div>
                    </div>
                    <Link href="/checkout" className="btn-primary w-full mt-6 flex items-center justify-center gap-2">
                        Proceed to Checkout <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link href="/products" className="block text-center text-sm text-gray-500 hover:text-accent mt-3">Continue Shopping</Link>
                </div>
            </div>
        </div>
    )
}
