'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import { MapPin, CreditCard, CheckCircle, ArrowRight } from 'lucide-react'
import api from '@/lib/api'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
    const items = useCartStore((s) => s.items)
    const subtotal = useCartStore((s) => s.subtotal())
    const clearCart = useCartStore((s) => s.clearCart)
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [shippingMethod, setShippingMethod] = useState('standard')
    const [couponCode, setCouponCode] = useState('')
    const [orderComplete, setOrderComplete] = useState(false)
    const [orderNumber, setOrderNumber] = useState('')
    const router = useRouter()

    const [address, setAddress] = useState({
        fullName: '', phone: '', street: '', city: '', state: '', postalCode: '', country: 'Malaysia'
    })

    const shippingCost = shippingMethod === 'express' ? 35 : subtotal >= 500 ? 0 : 15
    const total = subtotal + shippingCost

    async function handlePlaceOrder() {
        try {
            setLoading(true)
            // First create address
            const { data: addrData } = await api.post('/auth/me') // Verify logged in
            // Create the order
            const { data } = await api.post('/orders', {
                addressId: 'temp', // In real app, create address first
                shippingMethod,
                couponCode: couponCode || undefined,
            })
            if (data.success) {
                setOrderNumber(data.data.orderNumber)
                setOrderComplete(true)
                toast.success('Order placed successfully!')
            }
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to place order. Please ensure you are logged in and have items in cart.')
        } finally {
            setLoading(false)
        }
    }

    if (orderComplete) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center card p-12 max-w-md">
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-primary mb-2">Order Confirmed! 🎉</h2>
                    <p className="text-gray-500 mb-2">Your order <span className="font-mono font-bold">{orderNumber}</span> has been placed.</p>
                    <p className="text-sm text-gray-400 mb-6">We&apos;ll send you an email confirmation shortly.</p>
                    <button onClick={() => router.push('/products')} className="btn-primary">Continue Shopping</button>
                </div>
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-700 mb-3">Your cart is empty</h2>
                    <button onClick={() => router.push('/products')} className="btn-primary">Shop Now</button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-primary mb-8">Checkout</h1>

            {/* Steps */}
            <div className="flex items-center gap-4 mb-10">
                {[{ n: 1, label: 'Shipping', icon: <MapPin className="w-4 h-4" /> }, { n: 2, label: 'Payment', icon: <CreditCard className="w-4 h-4" /> }].map((s) => (
                    <button key={s.n} onClick={() => s.n <= step && setStep(s.n)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${step >= s.n ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {s.icon} {s.label}
                    </button>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {step === 1 && (
                        <div className="card p-6 space-y-5">
                            <h2 className="text-lg font-bold text-primary">Shipping Address</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label><input value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} className="input-field" required /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} className="input-field" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label><input value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} className="input-field" /></div>
                                <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label><input value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} className="input-field" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">City</label><input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="input-field" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">State</label><input value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} className="input-field" /></div>
                            </div>

                            {/* Shipping method */}
                            <div className="mt-6">
                                <h3 className="font-semibold text-sm mb-3">Shipping Method</h3>
                                <div className="space-y-2">
                                    {[
                                        { id: 'standard', label: 'Standard Shipping', desc: '3-5 business days', cost: subtotal >= 500 ? 'Free' : 'MMK 15.00' },
                                        { id: 'express', label: 'Express Shipping', desc: '1-2 business days', cost: 'MMK 35.00' },
                                    ].map((opt) => (
                                        <label key={opt.id} className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${shippingMethod === opt.id ? 'border-accent bg-accent/5' : 'border-gray-100 hover:border-gray-200'}`}>
                                            <div className="flex items-center gap-3">
                                                <input type="radio" name="shipping" checked={shippingMethod === opt.id} onChange={() => setShippingMethod(opt.id)} className="accent-accent" />
                                                <div>
                                                    <div className="text-sm font-medium">{opt.label}</div>
                                                    <div className="text-xs text-gray-500">{opt.desc}</div>
                                                </div>
                                            </div>
                                            <span className="text-sm font-semibold text-primary">{opt.cost}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button onClick={() => setStep(2)} className="btn-primary flex items-center gap-2">
                                Continue to Payment <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="card p-6 space-y-5">
                            <h2 className="text-lg font-bold text-primary">Payment</h2>
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
                                💡 In production, this would integrate with Stripe Elements for secure card payment. For now, click &quot;Place Order&quot; to simulate a successful payment.
                            </div>

                            {/* Coupon */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                                <div className="flex gap-2">
                                    <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="e.g. WELCOME10" className="input-field flex-1" />
                                    <button className="btn-outline text-sm py-2">Apply</button>
                                </div>
                            </div>

                            <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary w-full disabled:opacity-50">
                                {loading ? 'Processing...' : `Place Order — ${formatPrice(total)}`}
                            </button>
                        </div>
                    )}
                </div>

                {/* Order Summary */}
                <div className="card p-6 h-fit sticky top-24">
                    <h2 className="text-lg font-bold text-primary mb-4">Order Summary</h2>
                    <div className="space-y-3 mb-4">
                        {items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-gray-600 truncate max-w-[200px]">{item.product.name} × {item.quantity}</span>
                                <span className="font-medium">{formatPrice((item.variant?.price ?? item.product.price) * item.quantity)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>{shippingCost === 0 ? <span className="text-green-600">Free</span> : formatPrice(shippingCost)}</span></div>
                        <div className="border-t border-gray-100 pt-2 flex justify-between"><span className="font-bold">Total</span><span className="font-bold text-lg text-primary">{formatPrice(total)}</span></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
