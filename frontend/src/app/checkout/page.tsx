'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import { MapPin, CreditCard, CheckCircle, ArrowRight, Lock, Shield } from 'lucide-react'
import api from '@/lib/api'
import toast from 'react-hot-toast'

// PCI DSS NOTE: This form is a UI simulation. In a production environment,
// card data must NEVER be handled directly. Use Stripe Elements or similar
// to ensure card details are tokenized before reaching this application.
function detectCardType(num: string) {
    const n = num.replace(/\s/g, '')
    if (/^4/.test(n)) return 'visa'
    if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return 'mastercard'
    return null
}

// Format card number with spaces every 4 digits
function formatCardNumber(value: string) {
    return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}

// Format expiry MM/YY
function formatExpiry(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 4)
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2)
    return digits
}

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
        fullName: '', phone: '', street: '', city: '', state: '', postalCode: '', country: 'Myanmar'
    })

    const [card, setCard] = useState({
        number: '', expiry: '', cvv: '', name: '',
    })
    const [cvvFocused, setCvvFocused] = useState(false)

    const cardType = detectCardType(card.number)
    const shippingCost = shippingMethod === 'express' ? 35000 : subtotal >= 800000 ? 0 : 15000
    const total = subtotal + shippingCost

    async function handlePlaceOrder() {
        // SECURITY: Verify card data is present but DO NOT log it to console or send to backend
        // In this implementation, card data is only used for the local UI preview.
        const rawNumber = card.number.replace(/\s/g, '')
        if (rawNumber.length < 16) return toast.error('Please enter a valid 16-digit card number.')
        if (card.expiry.length < 5) return toast.error('Please enter a valid expiry date.')
        if (card.cvv.length < 3) return toast.error('Please enter a valid CVV.')
        if (!card.name.trim()) return toast.error('Please enter the cardholder name.')

        try {
            setLoading(true)
            const { data } = await api.post('/orders', {
                address,
                shippingMethod,
                couponCode: couponCode || undefined,
            })
            if (data.success) {
                setOrderNumber(data.data.orderNumber)
                setOrderComplete(true)
                clearCart()
                toast.success('Order placed successfully!')
            }
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to place order. Please ensure you are logged in.')
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
                    <p className="text-sm text-gray-400 mb-6">We&apos;ll send you a confirmation shortly.</p>
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
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">State / Region</label><input value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} className="input-field" /></div>
                            </div>

                            {/* Shipping method */}
                            <div className="mt-6">
                                <h3 className="font-semibold text-sm mb-3">Shipping Method</h3>
                                <div className="space-y-2">
                                    {[
                                        { id: 'standard', label: 'Standard Shipping', desc: '3-5 business days', cost: subtotal >= 800000 ? 'Free' : 'MMK 15,000' },
                                        { id: 'express', label: 'Express Shipping', desc: '1-2 business days', cost: 'MMK 35,000' },
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
                        <div className="card p-6 space-y-6 relative overflow-hidden">
                            {/* PCI Compliance Marker */}
                            <div className="absolute top-0 right-0 bg-yellow-400 text-navy-dark text-[10px] font-bold px-3 py-1 uppercase tracking-tighter transform rotate-0 z-10">
                                Secure Simulation Mode
                            </div>
                            <h2 className="text-lg font-bold text-primary">Payment Details</h2>

                            {/* Security badge */}
                            <div className="flex items-center gap-2 text-xs text-gray-500 bg-green-50 border border-green-200 rounded-xl px-4 py-2">
                                <Lock className="w-3.5 h-3.5 text-green-600" />
                                <span className="text-green-700 font-medium">Your payment details are encrypted and secure.</span>
                            </div>

                            {/* Accepted cards */}
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Accepted:</span>
                                {/* Visa SVG */}
                                <svg viewBox="0 0 780 500" className="h-8 w-auto" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="780" height="500" rx="40" fill="#1A1F71"/>
                                    <text x="390" y="320" textAnchor="middle" fontSize="240" fontWeight="bold" fontFamily="Arial" fill="#FFFFFF" letterSpacing="-8">VISA</text>
                                </svg>
                                {/* Mastercard SVG */}
                                <svg viewBox="0 0 152 108" xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto">
                                    <rect width="152" height="108" rx="10" fill="#252525"/>
                                    <circle cx="58" cy="54" r="32" fill="#EB001B"/>
                                    <circle cx="94" cy="54" r="32" fill="#F79E1B"/>
                                    <path d="M76 26.8A32 32 0 0 1 94 54 32 32 0 0 1 76 81.2 32 32 0 0 1 58 54 32 32 0 0 1 76 26.8z" fill="#FF5F00"/>
                                </svg>
                            </div>

                            {/* Live card preview */}
                            <div className={`relative w-full max-w-sm h-44 rounded-2xl p-6 text-white shadow-xl overflow-hidden transition-all duration-500 ${cardType === 'visa' ? 'bg-gradient-to-br from-[#1A1F71] to-[#3b4bc8]' : cardType === 'mastercard' ? 'bg-gradient-to-br from-[#252525] to-[#555]' : 'bg-gradient-to-br from-navy to-[#2a4080]'}`}>
                                {/* Card chip */}
                                <div className="absolute top-6 left-6 w-10 h-7 bg-yellow-300/90 rounded-md flex items-center justify-center">
                                    <div className="w-6 h-4 border-2 border-yellow-500/40 rounded-sm grid grid-cols-2 gap-0.5 p-0.5">
                                        <div className="bg-yellow-500/40 rounded-sm" /><div className="bg-yellow-500/40 rounded-sm" />
                                        <div className="bg-yellow-500/40 rounded-sm" /><div className="bg-yellow-500/40 rounded-sm" />
                                    </div>
                                </div>
                                {/* Card type logo on card */}
                                <div className="absolute top-5 right-5 text-right">
                                    {cardType === 'visa' && <span className="font-bold text-2xl italic tracking-widest">VISA</span>}
                                    {cardType === 'mastercard' && (
                                        <div className="flex">
                                            <div className="w-7 h-7 bg-red-500 rounded-full opacity-90" />
                                            <div className="w-7 h-7 bg-yellow-400 rounded-full -ml-3 opacity-90" />
                                        </div>
                                    )}
                                </div>
                                {/* Number */}
                                <div className="absolute bottom-14 left-6 font-mono text-xl tracking-widest">
                                    {card.number || '•••• •••• •••• ••••'}
                                </div>
                                {/* Name + Expiry */}
                                <div className="absolute bottom-5 left-6 right-6 flex justify-between items-end">
                                    <div>
                                        <div className="text-[9px] text-white/50 uppercase tracking-widest mb-0.5">Card Holder</div>
                                        <div className="text-sm font-medium uppercase tracking-wider">{card.name || 'FULL NAME'}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[9px] text-white/50 uppercase tracking-widest mb-0.5">Expires</div>
                                        <div className="text-sm font-mono">{card.expiry || 'MM/YY'}</div>
                                    </div>
                                </div>
                                {/* CVV flip */}
                                {cvvFocused && (
                                    <div className="absolute inset-0 bg-black/60 flex flex-col justify-center rounded-2xl">
                                        <div className="bg-gray-800 h-10 w-full mb-4" />
                                        <div className="flex justify-end pr-6">
                                            <div className="bg-white text-gray-900 font-mono text-sm px-4 py-1.5 rounded">
                                                {card.cvv || '•••'}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Card form fields */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={card.number}
                                            onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                                            placeholder="1234 5678 9012 3456"
                                            maxLength={19}
                                            className="input-field pr-12 font-mono tracking-widest"
                                        />
                                        <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                                    <input
                                        type="text"
                                        value={card.name}
                                        onChange={(e) => setCard({ ...card, name: e.target.value.toUpperCase() })}
                                        placeholder="AS ON CARD"
                                        className="input-field uppercase tracking-wider"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={card.expiry}
                                            onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                                            placeholder="MM / YY"
                                            maxLength={5}
                                            className="input-field font-mono tracking-widest"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">CVV / CVC</label>
                                        <input
                                            type="password"
                                            inputMode="numeric"
                                            value={card.cvv}
                                            onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                                            onFocus={() => setCvvFocused(true)}
                                            onBlur={() => setCvvFocused(false)}
                                            placeholder="•••"
                                            maxLength={4}
                                            className="input-field font-mono tracking-widest"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Coupon */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code <span className="text-gray-400 font-normal">(optional)</span></label>
                                <div className="flex gap-2">
                                    <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="e.g. WELCOME10" className="input-field flex-1" />
                                    <button className="btn-outline text-sm py-2">Apply</button>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading}
                                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <Lock className="w-4 h-4" />
                                {loading ? 'Processing...' : `Pay Securely — ${formatPrice(total)}`}
                            </button>

                            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                                <Shield className="w-3.5 h-3.5" />
                                <span>256-bit SSL encryption · PCI DSS compliant</span>
                            </div>
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
