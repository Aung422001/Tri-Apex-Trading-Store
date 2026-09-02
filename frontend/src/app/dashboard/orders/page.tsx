'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Package, ChevronRight, ShoppingBag } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'
import { formatPrice } from '@/lib/utils'

const statusColor: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    PROCESSING: 'bg-blue-100 text-blue-700',
    SHIPPED: 'bg-purple-100 text-purple-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
}

export default function OrdersPage() {
    const user = useAuthStore((s) => s.user)
    const router = useRouter()
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!user) { router.push('/login'); return }
        async function fetchOrders() {
            try {
                const { data } = await api.get('/orders?limit=50')
                if (data.success) {
                    // API returns { orders, total, ... } or just the array
                    setOrders(Array.isArray(data.data) ? data.data : data.data?.orders ?? [])
                }
            } catch (err: any) {
                setError('Failed to load orders. Please try again.')
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [user, router])

    if (!user) return null

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-primary">My Orders</h1>
                    <p className="text-gray-500 text-sm mt-1">Track and manage your purchases</p>
                </div>
                <Link href="/products" className="btn-primary text-sm">
                    Continue Shopping
                </Link>
            </div>

            {loading ? (
                <div className="card p-12 text-center">
                    <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading your orders...</p>
                </div>
            ) : error ? (
                <div className="card p-12 text-center">
                    <p className="text-red-500">{error}</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="card p-16 text-center">
                    <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No orders yet</h3>
                    <p className="text-gray-400 text-sm mb-6">When you place an order, it will appear here.</p>
                    <Link href="/products" className="btn-primary">Browse Products</Link>
                </div>
            ) : (
                <div className="card overflow-hidden">
                    <div className="divide-y divide-gray-50">
                        {orders.map((order: any) => (
                            <Link
                                key={order.id}
                                href={`/dashboard/orders/${order.id}`}
                                className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors group"
                            >
                                {/* Icon */}
                                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Package className="w-6 h-6 text-accent" />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-mono text-sm font-semibold text-primary">
                                            {order.orderNumber}
                                        </span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[order.status] ?? 'bg-gray-100 text-gray-700'}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric', month: 'long', day: 'numeric'
                                        })}
                                        {' · '}
                                        {order.items?.length ?? 0} item{(order.items?.length ?? 0) !== 1 ? 's' : ''}
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="text-right flex-shrink-0">
                                    <div className="font-bold text-primary">{formatPrice(order.total)}</div>
                                    {order.trackingNumber && (
                                        <div className="text-xs text-gray-400 mt-0.5">
                                            Tracking: {order.trackingNumber}
                                        </div>
                                    )}
                                </div>

                                <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 group-hover:text-accent transition-colors" />
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
