'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { BarChart3, Package, ShoppingCart, Users, TrendingUp, AlertTriangle, ArrowUpRight } from 'lucide-react'
import api from '@/lib/api'
import { formatPrice } from '@/lib/utils'

export default function AdminPage() {
    const user = useAuthStore((s) => s.user)
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await api.get('/orders/admin/all?limit=10')
                if (data.success) setOrders(data.data)
            } catch { } finally { setLoading(false) }
        }
        fetchData()
    }, [])

    if (!user || user.role !== 'ADMIN') {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center card p-8">
                    <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                    <h2 className="text-xl font-bold text-gray-700 mb-2">Access Denied</h2>
                    <p className="text-gray-500 mb-4">You need admin permissions to access this page.</p>
                    <Link href="/login" className="btn-primary">Sign In as Admin</Link>
                </div>
            </div>
        )
    }

    const stats = [
        { label: 'Total Revenue', value: formatPrice(orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0)), icon: <TrendingUp className="w-6 h-6 text-green-500" />, bg: 'bg-green-50', change: '+12%' },
        { label: 'Orders', value: orders.length.toString(), icon: <ShoppingCart className="w-6 h-6 text-blue-500" />, bg: 'bg-blue-50', change: '+8%' },
        { label: 'Products', value: '12', icon: <Package className="w-6 h-6 text-purple-500" />, bg: 'bg-purple-50', change: '' },
        { label: 'Customers', value: '2', icon: <Users className="w-6 h-6 text-accent" />, bg: 'bg-orange-50', change: '+5%' },
    ]

    const statusColor: Record<string, string> = {
        PENDING: 'bg-yellow-100 text-yellow-700',
        PROCESSING: 'bg-blue-100 text-blue-700',
        SHIPPED: 'bg-purple-100 text-purple-700',
        DELIVERED: 'bg-green-100 text-green-700',
        CANCELLED: 'bg-red-100 text-red-700',
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
                        <p className="text-gray-500">Welcome back, {user.name}</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/admin/products" className="btn-outline text-sm py-2">Manage Products</Link>
                        <Link href="/admin/orders" className="btn-primary text-sm py-2">View Orders</Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat) => (
                        <div key={stat.label} className="card p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>{stat.icon}</div>
                                {stat.change && <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">{stat.change}</span>}
                            </div>
                            <div className="text-2xl font-bold text-primary">{stat.value}</div>
                            <div className="text-sm text-gray-500">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Quick actions */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                    {[
                        { label: 'Add New Product', desc: 'Create a new product listing', href: '/admin/products/new', color: 'from-accent to-orange-500' },
                        { label: 'Process Orders', desc: 'Manage pending orders', href: '/admin/orders', color: 'from-blue-500 to-indigo-500' },
                        { label: 'Customer Feedback', desc: 'View feedback from users', href: '/admin/feedback', color: 'from-teal-500 to-emerald-500' },
                    ].map((action) => (
                        <Link key={action.label} href={action.href} className={`rounded-2xl bg-gradient-to-br ${action.color} text-white p-6 hover:shadow-xl transition-all group`}>
                            <h3 className="font-bold text-lg mb-1">{action.label}</h3>
                            <p className="text-white/80 text-sm">{action.desc}</p>
                            <ArrowUpRight className="w-5 h-5 mt-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    ))}
                </div>

                {/* Recent orders table */}
                <div className="card overflow-hidden">
                    <div className="flex items-center justify-between p-5 border-b border-gray-100">
                        <h2 className="font-bold text-primary flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Recent Orders</h2>
                    </div>
                    {loading ? (
                        <div className="p-8 text-center text-gray-400">Loading...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-gray-500">
                                    <tr>
                                        <th className="text-left px-5 py-3 font-medium">Order</th>
                                        <th className="text-left px-5 py-3 font-medium">Customer</th>
                                        <th className="text-left px-5 py-3 font-medium">Status</th>
                                        <th className="text-right px-5 py-3 font-medium">Total</th>
                                        <th className="text-right px-5 py-3 font-medium">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {orders.map((order: any) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-3 font-mono text-xs">{order.orderNumber}</td>
                                            <td className="px-5 py-3">{order.user?.name || 'N/A'}</td>
                                            <td className="px-5 py-3"><span className={`badge text-xs ${statusColor[order.status] || 'bg-gray-100'}`}>{order.status}</span></td>
                                            <td className="px-5 py-3 text-right font-medium">{formatPrice(order.total)}</td>
                                            <td className="px-5 py-3 text-right text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {orders.length === 0 && <div className="p-8 text-center text-gray-400">No orders yet</div>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
