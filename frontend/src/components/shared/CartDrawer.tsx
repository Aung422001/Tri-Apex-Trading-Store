'use client'

import Link from 'next/link'
import { X, ShoppingBag, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'

export default function CartDrawer() {
    const { items, isOpen, toggleDrawer, updateQuantity, removeItem } = useCartStore()
    const subtotal = useCartStore((s) => s.subtotal())
    const shipping = subtotal >= 800000 ? 0 : 15000

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
                    onClick={toggleDrawer}
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-bold text-primary">Your Cart</h2>
                        {items.length > 0 && (
                            <span className="bg-accent text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                {items.reduce((s, i) => s + i.quantity, 0)}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={toggleDrawer}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-8">
                            <ShoppingBag className="w-16 h-16 text-gray-200 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Your cart is empty</h3>
                            <p className="text-gray-400 text-sm mb-6">Add some products to get started</p>
                            <button
                                onClick={toggleDrawer}
                                className="btn-primary text-sm"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-100 px-4 py-2">
                            {items.map((item) => {
                                const price = item.variant?.price ?? item.product.price
                                return (
                                    <li key={item.id} className="py-4 flex gap-3">
                                        {/* Product image */}
                                        <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden relative border border-gray-100">
                                            {item.product.images?.[0]?.url ? (
                                                <img
                                                    src={item.product.images[0].url}
                                                    alt={item.product.name}
                                                    className="object-cover w-full h-full mix-blend-multiply"
                                                />
                                            ) : (
                                                <span className="text-2xl">🖨️</span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                href={`/products/${item.product.slug}`}
                                                onClick={toggleDrawer}
                                                className="text-sm font-medium text-gray-900 hover:text-accent transition-colors line-clamp-2"
                                            >
                                                {item.product.name}
                                            </Link>
                                            {item.variant && (
                                                <p className="text-xs text-gray-400 mt-0.5">{item.variant.name}</p>
                                            )}
                                            <p className="text-sm font-bold text-primary mt-1">{formatPrice(price)}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className="flex items-center border border-gray-200 rounded-lg">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1.5 hover:bg-gray-50 rounded-l-lg"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="w-7 text-center text-xs font-medium">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1.5 hover:bg-gray-50 rounded-r-lg"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-sm font-semibold text-gray-900 text-right">
                                            {formatPrice(price * item.quantity)}
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-gray-100 p-5 space-y-3">
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Subtotal</span>
                            <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Shipping</span>
                            <span className="font-medium">
                                {shipping === 0
                                    ? <span className="text-green-600">Free</span>
                                    : formatPrice(shipping)
                                }
                            </span>
                        </div>
                        <div className="flex justify-between font-bold text-primary border-t border-gray-100 pt-3">
                            <span>Total</span>
                            <span>{formatPrice(subtotal + shipping)}</span>
                        </div>
                        <Link
                            href="/checkout"
                            onClick={toggleDrawer}
                            className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
                        >
                            Proceed to Checkout
                        </Link>
                        <Link
                            href="/cart"
                            onClick={toggleDrawer}
                            className="block text-center text-sm text-gray-500 hover:text-accent transition-colors"
                        >
                            View Full Cart
                        </Link>
                    </div>
                )}
            </div>
        </>
    )
}
