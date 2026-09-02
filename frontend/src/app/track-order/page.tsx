'use client'

import { useState } from 'react'
import { Search, Package, Truck, CheckCircle, Clock, MapPin, ArrowRight, AlertCircle } from 'lucide-react'
import api from '@/lib/api'
import { formatPrice } from '@/lib/utils'

export default function TrackOrderPage() {
    const [orderNumber, setOrderNumber] = useState('')
    const [loading, setLoading] = useState(false)
    const [order, setOrder] = useState<any>(null)
    const [error, setError] = useState('')

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!orderNumber.trim()) return
        
        setLoading(true)
        setError('')
        setOrder(null)
        
        try {
            const { data } = await api.get(`/orders/track/${orderNumber.trim()}`)
            if (data.success) {
                setOrder(data.data)
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Order not found. Please check the order number and try again.')
        } finally {
            setLoading(false)
        }
    }

    const steps = [
        { status: 'PENDING', label: 'Order Placed', icon: <Package className="w-5 h-5" /> },
        { status: 'PROCESSING', label: 'Processing', icon: <Clock className="w-5 h-5" /> },
        { status: 'SHIPPED', label: 'Shipped', icon: <Truck className="w-5 h-5" /> },
        { status: 'DELIVERED', label: 'Delivered', icon: <CheckCircle className="w-5 h-5" /> },
    ]

    const getStatusIndex = (status: string) => {
        const index = steps.findIndex(s => s.status === status)
        return index === -1 ? 0 : index
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-primary mb-3">Track Your Order</h1>
                <p className="text-gray-500">Enter your order number to see real-time updates on your 3D printer delivery.</p>
            </div>

            <div className="card p-6 md:p-8 mb-8">
                <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input 
                            required
                            value={orderNumber}
                            onChange={e => setOrderNumber(e.target.value)}
                            className="input-field pl-12 h-14 text-lg font-mono tracking-wider" 
                            placeholder="e.g. TRX-17123..." 
                        />
                    </div>
                    <button disabled={loading} className="btn-primary h-14 px-8 text-lg flex items-center justify-center gap-2 min-w-[180px]">
                        {loading ? 'Searching...' : 'Track Order'} <ArrowRight className="w-5 h-5" />
                    </button>
                </form>

                {error && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm">
                        <AlertCircle className="w-5 h-5" /> {error}
                    </div>
                )}
            </div>

            {order && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Status timeline */}
                        <div className="md:col-span-2 card p-8">
                            <h2 className="text-xl font-bold text-primary mb-8">Shipment Status</h2>
                            
                            <div className="relative space-y-8">
                                {steps.map((step, idx) => {
                                    const isCompleted = getStatusIndex(order.status) >= idx
                                    const isCurrent = order.status === step.status
                                    
                                    return (
                                        <div key={idx} className="flex items-start gap-4 relative">
                                            {idx !== steps.length - 1 && (
                                                <div className={`absolute left-6 top-10 w-0.5 h-10 ${isCompleted ? 'bg-accent' : 'bg-gray-100'}`} />
                                            )}
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 z-10 ${isCompleted ? 'bg-accent text-white shadow-lg shadow-accent/30' : 'bg-gray-100 text-gray-400'}`}>
                                                {step.icon}
                                            </div>
                                            <div className="pt-2">
                                                <h3 className={`font-bold ${isCurrent ? 'text-primary' : isCompleted ? 'text-gray-700' : 'text-gray-400'}`}>{step.label}</h3>
                                                {isCurrent && <p className="text-xs text-accent font-medium mt-0.5 animate-pulse">In Progress</p>}
                                                {!isCurrent && isCompleted && <p className="text-xs text-green-500 font-medium mt-0.5">Completed</p>}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {order.trackingNumber && (
                                <div className="mt-10 p-5 bg-accent/5 rounded-2xl border-2 border-accent/10">
                                    <div className="text-xs text-accent font-bold uppercase tracking-widest mb-1">Tracking Number</div>
                                    <div className="text-2xl font-mono font-bold text-primary">{order.trackingNumber}</div>
                                    <p className="text-sm text-gray-500 mt-2">Use this number to track directly on the courier website.</p>
                                </div>
                            )}
                        </div>

                        {/* Order info summary */}
                        <div className="space-y-6">
                            <div className="card p-6">
                                <h3 className="font-bold text-primary mb-4">Order Details</h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-[10px] text-gray-400 uppercase tracking-wider">Order Date</div>
                                        <div className="text-sm font-medium">{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-gray-400 uppercase tracking-wider">Destination</div>
                                        <div className="text-sm font-medium flex items-center gap-1.5 mt-0.5"><MapPin className="w-3.5 h-3.5 text-accent" /> {order.location}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-gray-400 uppercase tracking-wider">Items</div>
                                        <div className="space-y-2 mt-2">
                                            {order.items.map((item: any) => (
                                                <div key={item.id} className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden border border-gray-100">
                                                        {item.product?.images?.[0] && (
                                                            <img src={item.product.images[0].url} alt="" className="w-full h-full object-cover" />
                                                        )}
                                                    </div>
                                                    <div className="text-xs">
                                                        <div className="font-medium text-gray-800 line-clamp-1">{item.product?.name}</div>
                                                        <div className="text-gray-400">Qty: {item.quantity}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
