'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Package, ArrowLeft, MapPin, Truck, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'
import { formatPrice } from '@/lib/utils'

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    PENDING:    { label: 'Pending',    color: 'text-yellow-600 bg-yellow-50 border-yellow-200',  icon: Clock },
    PROCESSING: { label: 'Processing', color: 'text-blue-600 bg-blue-50 border-blue-200',        icon: AlertCircle },
    SHIPPED:    { label: 'Shipped',    color: 'text-purple-600 bg-purple-50 border-purple-200',  icon: Truck },
    DELIVERED:  { label: 'Delivered',  color: 'text-green-600 bg-green-50 border-green-200',     icon: CheckCircle2 },
    CANCELLED:  { label: 'Cancelled',  color: 'text-red-600 bg-red-50 border-red-200',           icon: XCircle },
}

const steps = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED']

export default function OrderDetailPage() {
    const user = useAuthStore((s) => s.user)
    const router = useRouter()
    const params = useParams()
    const orderId = params?.id as string

    const [order, setOrder] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [cancelling, setCancelling] = useState(false)

    useEffect(() => {
        if (!user) { router.push('/login'); return }
        if (!orderId) return
        async function fetchOrder() {
            try {
                const { data } = await api.get(`/orders/${orderId}`)
                if (data.success) setOrder(data.data)
                else setError('Order not found.')
            } catch (err: any) {
                setError(err.response?.data?.error || 'Failed to load order.')
            } finally {
                setLoading(false)
            }
        }
        fetchOrder()
    }, [user, router, orderId])

    const [confirmCancel, setConfirmCancel] = useState(false)

    async function handleCancel() {
        if (!confirmCancel) {
            setConfirmCancel(true)
            return
        }
        setCancelling(true)
        try {
            await api.put(`/orders/${orderId}/cancel`)
            const { data } = await api.get(`/orders/${orderId}`)
            if (data.success) setOrder(data.data)
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to cancel order.')
        } finally {
            setCancelling(false)
        }
    }

    if (loading) return (
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading order details...</p>
        </div>
    )

    if (error || !order) return (
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
            <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-600 mb-2">{error || 'Order not found'}</h2>
            <Link href="/dashboard/orders" className="btn-primary mt-4 inline-block">← Back to Orders</Link>
        </div>
    )

    const status = statusConfig[order.status] ?? statusConfig['PENDING']
    const StatusIcon = status.icon
    const currentStep = steps.indexOf(order.status)
    const isCancellable = ['PENDING', 'PROCESSING'].includes(order.status)

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            {/* Back */}
            <Link href="/dashboard/orders" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-accent mb-6 transition-colors w-fit">
                <ArrowLeft className="w-4 h-4" /> Back to Orders
            </Link>

            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-xl font-bold text-primary font-mono">{order.orderNumber}</h1>
                    <p className="text-sm text-gray-400 mt-0.5">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <span className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full border ${status.color}`}>
                    <StatusIcon className="w-4 h-4" />
                    {status.label}
                </span>
            </div>

            {/* Progress tracker */}
            {order.status !== 'CANCELLED' && (
                <div className="card p-5 mb-6">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute left-0 right-0 top-4 h-0.5 bg-gray-100 z-0" />
                        <div
                            className="absolute left-0 top-4 h-0.5 bg-accent z-0 transition-all duration-500"
                            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                        />
                        {steps.map((step, i) => {
                            const done = i <= currentStep
                            return (
                                <div key={step} className="flex flex-col items-center gap-1 z-10">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${done ? 'bg-accent border-accent text-white' : 'bg-white border-gray-200 text-gray-300'}`}>
                                        {done ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-gray-200" />}
                                    </div>
                                    <span className={`text-xs font-medium capitalize ${done ? 'text-accent' : 'text-gray-400'}`}>
                                        {step.charAt(0) + step.slice(1).toLowerCase()}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                    {order.trackingNumber && (
                        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2 text-sm text-gray-500">
                            <Truck className="w-4 h-4 text-accent" />
                            Tracking: <span className="font-mono font-semibold text-primary">{order.trackingNumber}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Items */}
            <div className="card overflow-hidden mb-6">
                <div className="p-4 border-b border-gray-50">
                    <h2 className="font-semibold text-primary text-sm">Order Items</h2>
                </div>
                <div className="divide-y divide-gray-50">
                    {order.items?.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-4 p-4">
                            <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                                {item.product?.images?.[0]?.url
                                    ? <img src={item.product.images[0].url} alt={item.product?.name} className="w-full h-full object-cover" />
                                    : <Package className="w-6 h-6 text-gray-300" />
                                }
                            </div>
                            <div className="flex-1 min-w-0">
                                <Link href={`/products/${item.product?.slug ?? '#'}`} className="font-medium text-sm text-primary hover:text-accent transition-colors line-clamp-1">
                                    {item.product?.name ?? 'Product'}
                                </Link>
                                {item.variant && <div className="text-xs text-gray-400">{item.variant.name}</div>}
                                <div className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</div>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <div className="font-semibold text-sm text-primary">{formatPrice(item.total)}</div>
                                <div className="text-xs text-gray-400">{formatPrice(item.price)} each</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Summary + Address side by side */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Order summary */}
                <div className="card p-5">
                    <h2 className="font-semibold text-sm text-primary mb-4">Order Summary</h2>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-gray-500">
                            <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
                        </div>
                        {order.discount > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>Discount</span><span>− {formatPrice(order.discount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-gray-500">
                            <span>Shipping</span>
                            <span>{order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-primary border-t border-gray-100 pt-2 mt-2">
                            <span>Total</span><span>{formatPrice(order.total)}</span>
                        </div>
                    </div>
                </div>

                {/* Shipping address */}
                {order.address && (
                    <div className="card p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin className="w-4 h-4 text-accent" />
                            <h2 className="font-semibold text-sm text-primary">Shipping Address</h2>
                        </div>
                        <div className="text-sm text-gray-600 space-y-0.5">
                            <div className="font-medium">{order.address.fullName}</div>
                            <div>{order.address.address}</div>
                            {order.address.address2 && <div>{order.address.address2}</div>}
                            <div>{order.address.city}{order.address.state ? `, ${order.address.state}` : ''}</div>
                            <div>{order.address.country}</div>
                            {order.address.phone && <div className="text-gray-400">{order.address.phone}</div>}
                        </div>
                    </div>
                )}
            </div>

            {/* Cancel button */}
            {isCancellable && (
                <div className="text-center flex flex-col items-center gap-2">
                    <button
                        onClick={handleCancel}
                        disabled={cancelling}
                        className={`text-sm px-6 py-2.5 rounded-xl transition-all disabled:opacity-50 ${confirmCancel
                                ? 'bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-500/20'
                                : 'text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400'
                            }`}
                    >
                        {cancelling ? 'Cancelling...' : confirmCancel ? 'Are you sure? Yes, cancel it' : 'Cancel Order'}
                    </button>
                    {confirmCancel && !cancelling && (
                        <button
                            onClick={() => setConfirmCancel(false)}
                            className="text-xs text-gray-400 hover:text-gray-600 underline"
                        >
                            No, keep my order
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}
