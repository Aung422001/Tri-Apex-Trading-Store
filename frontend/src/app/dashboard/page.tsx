'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { Package, ShoppingBag, Heart, Settings, ChevronRight, Star } from 'lucide-react'
import api from '@/lib/api'
import { formatPrice } from '@/lib/utils'

export default function DashboardPage() {
    const user = useAuthStore((s) => s.user)
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchOrders() {
            try {
                const { data } = await api.get('/orders?limit=5')
                if (data.success) setOrders(data.data)
            } catch { } finally { setLoading(false) }
        }
        fetchOrders()
    }, [])

    if (!user) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-700 mb-3">Please sign in</h2>
                    <Link href="/login" className="btn-primary">Sign In</Link>
                </div>
            </div>
        )
    }

    const statusColor: Record<string, string> = {
        PENDING: 'bg-yellow-100 text-yellow-700',
        PROCESSING: 'bg-blue-100 text-blue-700',
        SHIPPED: 'bg-purple-100 text-purple-700',
        DELIVERED: 'bg-green-100 text-green-700',
        CANCELLED: 'bg-red-100 text-red-700',
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-2xl text-white font-bold">
                    {user.name[0]}
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-primary">Welcome, {user.name}! 👋</h1>
                    <p className="text-gray-500">{user.email}</p>
                </div>
            </div>

            {/* Quick links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {[
                    { label: 'My Orders', icon: <Package className="w-6 h-6 text-accent" />, href: '/dashboard/orders', count: orders.length },
                    { label: 'Wishlist', icon: <Heart className="w-6 h-6 text-accent" />, href: '/dashboard/wishlist' },
                    { label: 'Shop', icon: <ShoppingBag className="w-6 h-6 text-accent" />, href: '/products' },
                    { label: 'Settings', icon: <Settings className="w-6 h-6 text-accent" />, href: '/dashboard/settings' },
                ].map((item) => (
                    <Link key={item.label} href={item.href} className="card-hover p-5 flex items-center gap-4">
                        <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">{item.icon}</div>
                        <div>
                            <div className="font-semibold text-sm">{item.label}</div>
                            {item.count !== undefined && <div className="text-xs text-gray-400">{item.count} orders</div>}
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 ml-auto" />
                    </Link>
                ))}
            </div>

            {/* Recent orders */}
            <div className="card overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <h2 className="font-bold text-primary">Recent Orders</h2>
                    <Link href="/dashboard/orders" className="text-sm text-accent hover:underline">View All</Link>
                </div>
                {loading ? (
                    <div className="p-8 text-center text-gray-400">Loading orders...</div>
                ) : orders.length === 0 ? (
                    <div className="p-8 text-center">
                        <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                        <p className="text-gray-400">No orders yet</p>
                        <Link href="/products" className="text-accent text-sm hover:underline">Start shopping →</Link>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {orders.map((order: any) => (
                            <Link key={order.id} href={`/dashboard/orders/${order.id}`} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                                <div>
                                    <div className="font-mono text-sm font-medium">{order.orderNumber}</div>
                                    <div className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</div>
                                </div>
                                <div className="text-right">
                                    <span className={`badge text-xs ${statusColor[order.status] || 'bg-gray-100 text-gray-700'}`}>{order.status}</span>
                                    <div className="text-sm font-semibold text-primary mt-1">{formatPrice(order.total)}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
