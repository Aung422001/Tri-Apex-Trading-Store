'use client'

import { useEffect, useState } from 'react'
import { Search, Filter, Package as PackageIcon, Truck, CheckCircle, XCircle, MapPin, Eye, Edit3, X } from 'lucide-react'
import api from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState<any>(null)
    const [editStatus, setEditStatus] = useState('')
    const [trackingNumber, setTrackingNumber] = useState('')
    const [updating, setUpdating] = useState(false)

    useEffect(() => {
        fetchOrders()
    }, [])

    async function fetchOrders() {
        setLoading(true)
        try {
            const { data } = await api.get('/orders/admin/all')
            if (data.success) setOrders(data.data)
        } catch (err: any) {
            toast.error('Failed to fetch orders')
        } finally {
            setLoading(false)
        }
    }

    const openEditModal = (order: any) => {
        setSelectedOrder(order)
        setEditStatus(order.status)
        setTrackingNumber(order.trackingNumber || '')
    }

    const handleUpdateStatus = async () => {
        setUpdating(true)
        try {
            const { data } = await api.put(`/orders/admin/${selectedOrder.id}/status`, {
                status: editStatus,
                trackingNumber
            })
            if (data.success) {
                toast.success('Order updated successfully')
                setSelectedOrder(null)
                fetchOrders()
            }
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to update order')
        } finally {
            setUpdating(false)
        }
    }

    const statusColors: any = {
        PENDING: 'bg-yellow-100 text-yellow-700',
        PROCESSING: 'bg-blue-100 text-blue-700',
        SHIPPED: 'bg-purple-100 text-purple-700',
        DELIVERED: 'bg-green-100 text-green-700',
        CANCELLED: 'bg-red-100 text-red-700',
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Manage Orders</h1>
                    <p className="text-gray-500">View customer locations and update tracking status.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input className="input-field pl-10" placeholder="Search by Order # or Customer name..." />
                </div>
                <button className="btn-outline flex items-center gap-2"><Filter className="w-4 h-4" /> Filter Status</button>
            </div>

            {loading ? (
                <div className="p-20 text-center text-gray-400">Loading orders...</div>
            ) : (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-500">
                                <tr>
                                    <th className="text-left px-5 py-4 font-medium">Order #</th>
                                    <th className="text-left px-5 py-4 font-medium">Customer & Location</th>
                                    <th className="text-left px-5 py-4 font-medium">Status</th>
                                    <th className="text-right px-5 py-4 font-medium">Total</th>
                                    <th className="text-right px-5 py-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-all">
                                        <td className="px-5 py-4">
                                            <div className="font-mono text-xs font-bold text-gray-800">{order.orderNumber}</div>
                                            <div className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="font-medium text-gray-900">{order.user?.name}</div>
                                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                                <MapPin className="w-3 h-3" /> {order.address?.city}, {order.address?.state}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                                                {order.status}
                                            </span>
                                            {order.trackingNumber && (
                                                <div className="text-[10px] text-gray-400 mt-1 font-mono">Track: {order.trackingNumber}</div>
                                            )}
                                        </td>
                                        <td className="px-5 py-4 text-right font-bold text-primary">
                                            {formatPrice(order.total)}
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <button onClick={() => openEditModal(order)} className="btn-outline py-1 px-3 text-xs inline-flex items-center gap-1.5 focus:ring-0">
                                                <Edit3 className="w-3.5 h-3.5" /> Manage
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {orders.length === 0 && <div className="p-10 text-center text-gray-400">No orders found.</div>}
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-primary">Order {selectedOrder.orderNumber}</h2>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Address detail */}
                            <div className="bg-gray-50 rounded-xl p-4 text-sm">
                                <h3 className="font-bold text-gray-400 uppercase text-[10px] tracking-wider mb-2">Shipping To</h3>
                                <p className="font-medium text-gray-800">{selectedOrder.address?.fullName}</p>
                                <p className="text-gray-500">{selectedOrder.address?.street}</p>
                                <p className="text-gray-500">{selectedOrder.address?.city}, {selectedOrder.address?.state} {selectedOrder.address?.postalCode}</p>
                                <p className="text-gray-500">{selectedOrder.address?.phone}</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
                                    <select value={editStatus} onChange={e => setEditStatus(e.target.value)} className="input-field">
                                        <option value="PENDING">PENDING</option>
                                        <option value="PROCESSING">PROCESSING</option>
                                        <option value="SHIPPED">SHIPPED</option>
                                        <option value="DELIVERED">DELIVERED</option>
                                        <option value="CANCELLED">CANCELLED</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tracking Number</label>
                                    <input value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} placeholder="e.g. TRX123456789" className="input-field" />
                                    <p className="text-[10px] text-gray-400 mt-1">Provide this so the customer can track their order.</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 flex gap-3">
                            <button onClick={() => setSelectedOrder(null)} className="btn-outline flex-1">Cancel</button>
                            <button onClick={handleUpdateStatus} disabled={updating} className="btn-primary flex-1 disabled:opacity-50">
                                {updating ? 'Updating...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
