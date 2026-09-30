'use client'

import { useState } from 'react'

type Access = 'public' | 'user' | 'admin'

interface Endpoint {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    path: string
    title: string
    access: Access
    limiter?: 'auth' | 'ai' | 'api'
    validation?: string
    handler: string
    // Where the web app calls it from; undefined means no screen calls it yet.
    caller?: { where: string; via: string }
}

interface Module {
    name: string
    endpoints: Endpoint[]
}

// Mirrors backend/src/routes/*.routes.ts and the api.* calls in the frontend.
const MODULES: Module[] = [
    {
        name: 'auth',
        endpoints: [
            { method: 'POST', path: '/auth/register', title: 'Create an account', access: 'public', limiter: 'auth', validation: 'registerSchema', handler: 'authController.register', caller: { where: '/register', via: 'authStore' } },
            { method: 'POST', path: '/auth/login', title: 'Sign in', access: 'public', limiter: 'auth', validation: 'loginSchema', handler: 'authController.login', caller: { where: '/login', via: 'authStore' } },
            { method: 'POST', path: '/auth/refresh', title: 'Refresh the session', access: 'public', handler: 'authController.refresh', caller: { where: 'every page', via: 'axios 401 interceptor' } },
            { method: 'POST', path: '/auth/logout', title: 'Sign out', access: 'user', handler: 'authController.logout', caller: { where: 'navbar menu', via: 'authStore' } },
            { method: 'GET', path: '/auth/me', title: 'Load the signed-in user', access: 'user', handler: 'authController.getMe' },
            { method: 'POST', path: '/auth/forgot-password', title: 'Request a reset email', access: 'public', limiter: 'auth', handler: 'authController.forgotPassword', caller: { where: '/forgot-password', via: 'page' } },
            { method: 'POST', path: '/auth/reset-password', title: 'Set a new password', access: 'public', limiter: 'auth', handler: 'authController.resetPassword', caller: { where: '/reset-password', via: 'page' } },
        ],
    },
    {
        name: 'products',
        endpoints: [
            { method: 'GET', path: '/products', title: 'List the catalog', access: 'public', handler: 'productController.list', caller: { where: '/products', via: 'page' } },
            { method: 'GET', path: '/products/:slug', title: 'Open a product', access: 'public', handler: 'productController.getBySlug', caller: { where: '/products/[slug]', via: 'page' } },
            { method: 'POST', path: '/products', title: 'Add a product', access: 'admin', validation: 'createProductSchema', handler: 'productController.create', caller: { where: '/admin/products/new', via: 'page' } },
            { method: 'PUT', path: '/products/:id', title: 'Edit a product', access: 'admin', validation: 'updateProductSchema', handler: 'productController.update' },
            { method: 'DELETE', path: '/products/:id', title: 'Remove a product', access: 'admin', handler: 'productController.delete' },
        ],
    },
    {
        name: 'categories',
        endpoints: [
            { method: 'GET', path: '/categories', title: 'List categories', access: 'public', handler: 'productController.getCategories' },
        ],
    },
    {
        name: 'cart',
        endpoints: [
            { method: 'GET', path: '/cart', title: 'Load the cart', access: 'user', handler: 'cartController.getCart', caller: { where: '/cart', via: 'cartStore' } },
            { method: 'POST', path: '/cart/items', title: 'Add to cart', access: 'user', handler: 'cartController.addItem', caller: { where: '/products/[slug]', via: 'cartStore' } },
            { method: 'PUT', path: '/cart/items/:itemId', title: 'Change a quantity', access: 'user', handler: 'cartController.updateItem', caller: { where: '/cart and cart drawer', via: 'cartStore' } },
            { method: 'DELETE', path: '/cart/items/:itemId', title: 'Remove an item', access: 'user', handler: 'cartController.removeItem', caller: { where: '/cart and cart drawer', via: 'cartStore' } },
            { method: 'DELETE', path: '/cart', title: 'Empty the cart', access: 'user', handler: 'cartController.clearCart', caller: { where: '/checkout', via: 'cartStore' } },
        ],
    },
    {
        name: 'orders',
        endpoints: [
            { method: 'GET', path: '/orders/track/:orderNumber', title: 'Track an order', access: 'public', handler: 'orderController.track', caller: { where: '/track-order', via: 'page' } },
            { method: 'POST', path: '/orders', title: 'Place an order', access: 'user', validation: 'createOrderSchema', handler: 'orderController.create', caller: { where: '/checkout', via: 'page' } },
            { method: 'GET', path: '/orders', title: 'List my orders', access: 'user', handler: 'orderController.getUserOrders', caller: { where: '/dashboard/orders', via: 'page' } },
            { method: 'GET', path: '/orders/:id', title: 'Open one of my orders', access: 'user', handler: 'orderController.getById', caller: { where: '/dashboard/orders/[id]', via: 'page' } },
            { method: 'PUT', path: '/orders/:id/cancel', title: 'Cancel an order', access: 'user', handler: 'orderController.cancel', caller: { where: '/dashboard/orders/[id]', via: 'page' } },
            { method: 'GET', path: '/orders/admin/all', title: 'See every order', access: 'admin', handler: 'orderController.adminGetAll', caller: { where: '/admin/orders', via: 'page' } },
            { method: 'PUT', path: '/orders/admin/:id/status', title: 'Move an order along', access: 'admin', validation: 'updateOrderStatusSchema', handler: 'orderController.adminUpdateStatus', caller: { where: '/admin/orders', via: 'page' } },
        ],
    },
    {
        name: 'payments',
        endpoints: [
            { method: 'POST', path: '/payments/intent', title: 'Start a card payment', access: 'user', handler: 'paymentController.createIntent' },
            { method: 'POST', path: '/payments/webhook', title: 'Confirm a payment', access: 'public', handler: 'paymentController.webhook', caller: { where: 'Stripe servers', via: 'signed webhook' } },
        ],
    },
    {
        name: 'ai',
        endpoints: [
            { method: 'POST', path: '/ai/chat', title: 'Chat with the assistant', access: 'public', limiter: 'ai', handler: 'aiController.chat · Claude', caller: { where: 'every page', via: 'AI chat widget' } },
            { method: 'POST', path: '/ai/price-compare', title: 'Compare market prices', access: 'public', limiter: 'ai', handler: 'aiController.priceCompare', caller: { where: '/products/[slug]', via: 'page' } },
            { method: 'POST', path: '/ai/recommend', title: 'Recommend a printer', access: 'public', limiter: 'ai', handler: 'aiController.recommend · Gemini' },
            { method: 'POST', path: '/ai/compare', title: 'Compare two printers', access: 'public', limiter: 'ai', handler: 'aiController.compare · Gemini' },
            { method: 'POST', path: '/ai/generate-description', title: 'Draft product copy', access: 'admin', handler: 'aiController.generateDescription · Gemini' },
            { method: 'POST', path: '/ai/analyze-image', title: 'Read a product photo', access: 'admin', handler: 'aiController.analyzeImage · Gemini' },
        ],
    },
    {
        name: 'feedback',
        endpoints: [
            { method: 'POST', path: '/feedback', title: 'Send feedback', access: 'public', limiter: 'api', handler: 'feedbackController.submitFeedback', caller: { where: '/contact', via: 'page' } },
            { method: 'GET', path: '/feedback', title: 'Read feedback', access: 'admin', handler: 'feedbackController.getFeedback', caller: { where: '/admin/feedback', via: 'page' } },
        ],
    },
]

const TOTAL = MODULES.reduce((n, m) => n + m.endpoints.length, 0)
const MAX_COLS = Math.max(...MODULES.map((m) => m.endpoints.length))

const ACCESS: Record<Access, { label: string; tile: string; swatch: string; detail: string }> = {
    public: { label: 'Anyone', tile: 'bg-[#D6E0EB]', swatch: 'bg-[#D6E0EB]', detail: 'public, no sign-in' },
    user: { label: 'Signed-in customer', tile: 'bg-[#7C98B6]', swatch: 'bg-[#7C98B6]', detail: 'signed-in customer (JWT cookie)' },
    admin: { label: 'Admin only', tile: 'bg-[#1E3A5F]', swatch: 'bg-[#1E3A5F]', detail: 'admin role (JWT + authorize)' },
}

const LIMITER: Record<string, string> = {
    auth: 'auth limiter, per 15 minutes',
    ai: 'AI limiter, per minute',
    api: 'general API limiter',
}

const STRIPES = 'repeating-linear-gradient(135deg, rgba(255,255,255,0.55) 0 3px, transparent 3px 7px)'

export default function ShowcaseMatrix() {
    const [selected, setSelected] = useState<[number, number]>([4, 0])
    const mod = MODULES[selected[0]]
    const ep = mod.endpoints[selected[1]]

    return (
        <div className="min-h-screen bg-[#F4F5F1] text-[#16202B]">
            <div className="max-w-6xl mx-auto px-4 py-16 md:py-20">
                {/* Intro */}
                <div className="grid md:grid-cols-[200px_1fr] gap-6 md:gap-10 mb-14">
                    <div className="font-mono text-xs tracking-[0.12em] uppercase text-[#5B6B7A] md:pt-3">Project showcase</div>
                    <div className="max-w-2xl">
                        <h1 className="font-body font-bold text-4xl md:text-5xl leading-[1.1] tracking-tight text-[#16202B] mb-6" style={{ fontFamily: 'var(--font-body)' }}>
                            Eight modules make thirty-five endpoints.
                        </h1>
                        <p className="text-[17px] leading-relaxed text-[#2A3642]">
                            Triapex is a full-stack store for 3D printers in Myanmar: a Next.js storefront over an Express and Prisma API on
                            PostgreSQL. Every square below is one real <strong>route</strong>. Its shade says who may call it, and the stripes mark
                            routes that no screen uses yet, which is where the next features plug in.
                        </p>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 text-sm font-medium">
                            <a href="/" className="text-[#1E3A5F] underline underline-offset-4 decoration-[#1E3A5F]/30 hover:decoration-[#1E3A5F]">Open the live store →</a>
                            <a href="https://github.com/aung422001/tri-apex-trading-store" target="_blank" rel="noopener noreferrer" className="text-[#1E3A5F] underline underline-offset-4 decoration-[#1E3A5F]/30 hover:decoration-[#1E3A5F]">Source on GitHub ↗</a>
                        </div>
                    </div>
                </div>

                {/* Matrix + detail */}
                <div className="grid lg:grid-cols-[auto_1fr] gap-10 lg:gap-14 items-start">
                    <div className="overflow-x-auto -mx-4 px-4">
                        <table className="border-separate border-spacing-[5px] sm:border-spacing-[6px] -ml-[6px]" role="grid" aria-label="API endpoints by module">
                            <thead>
                                <tr>
                                    <th className="font-mono text-[10px] tracking-[0.1em] uppercase text-[#5B6B7A] font-medium text-left pr-2 leading-tight sm:whitespace-nowrap">Module ↓ route →</th>
                                    {Array.from({ length: MAX_COLS }, (_, i) => (
                                        <th key={i} className="font-mono text-[11px] text-[#5B6B7A] font-medium w-8 sm:w-11">{i + 1}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {MODULES.map((m, r) => (
                                    <tr key={m.name}>
                                        <th scope="row" className="font-mono text-[12px] text-[#3E4D5C] font-medium text-right pr-3">{m.name}</th>
                                        {Array.from({ length: MAX_COLS }, (_, c) => {
                                            const e = m.endpoints[c]
                                            if (!e) return <td key={c} />
                                            const active = selected[0] === r && selected[1] === c
                                            return (
                                                <td key={c} className="p-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelected([r, c])}
                                                        aria-pressed={active}
                                                        aria-label={`${e.method} ${e.path}: ${e.title}`}
                                                        title={`${e.method} ${e.path}`}
                                                        className={`block w-8 h-8 sm:w-11 sm:h-11 rounded-md sm:rounded-lg transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] ${ACCESS[e.access].tile} ${active ? 'ring-2 ring-[#16202B] ring-offset-2 ring-offset-[#F4F5F1]' : ''}`}
                                                        style={e.caller ? undefined : { backgroundImage: STRIPES }}
                                                    />
                                                </td>
                                            )
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-6 text-sm text-[#2A3642]">
                            {(Object.keys(ACCESS) as Access[]).map((a) => (
                                <span key={a} className="inline-flex items-center gap-2">
                                    <span className={`w-3.5 h-3.5 rounded-[3px] ${ACCESS[a].swatch}`} />
                                    {ACCESS[a].label}
                                </span>
                            ))}
                            <span className="inline-flex items-center gap-2">
                                <span className="w-3.5 h-3.5 rounded-[3px] bg-[#7C98B6]" style={{ backgroundImage: STRIPES }} />
                                No screen calls it yet
                            </span>
                        </div>
                        <p className="text-sm text-[#5B6B7A] mt-3">Rows: the API module. Squares: one route each, {TOTAL} in all. Pick any square.</p>
                    </div>

                    {/* Detail card */}
                    <div className="bg-white border border-[#DDE2DA] rounded-2xl p-6 md:p-7 lg:sticky lg:top-8" aria-live="polite">
                        <div className="font-mono text-xs tracking-[0.12em] uppercase text-[#5B6B7A] mb-3">
                            Route · {mod.name} · {selected[1] + 1}
                        </div>
                        <h2 className="font-bold text-2xl md:text-[28px] leading-tight text-[#16202B] mb-6" style={{ fontFamily: 'var(--font-body)' }}>
                            {ep.title}
                        </h2>

                        <div className="grid sm:grid-cols-[1fr_auto_1fr] items-center gap-3 mb-7">
                            <div className="bg-[#EAEEE8] rounded-xl p-4 min-w-0">
                                <div className="font-mono text-[11px] tracking-[0.1em] uppercase text-[#5B6B7A] mb-2">Request</div>
                                <div className="font-mono text-sm font-semibold text-[#1E3A5F]">{ep.method}</div>
                                <div className="font-mono text-[15px] text-[#16202B] break-all">{ep.path}</div>
                            </div>
                            <div className="text-[#5B6B7A] text-center hidden sm:block">←</div>
                            <div className={`rounded-xl p-4 min-w-0 ${ep.caller ? 'bg-[#EAEEE8]' : 'border border-dashed border-[#B9C3CC]'}`}>
                                <div className="font-mono text-[11px] tracking-[0.1em] uppercase text-[#5B6B7A] mb-2">Called from</div>
                                {ep.caller ? (
                                    <>
                                        <div className="text-[17px] text-[#16202B] break-words">{ep.caller.where}</div>
                                        <div className="font-mono text-[13px] text-[#5B6B7A]">{ep.caller.via}</div>
                                    </>
                                ) : (
                                    <div className="text-[15px] text-[#5B6B7A]">No screen yet. The API is ready.</div>
                                )}
                            </div>
                        </div>

                        <dl className="grid grid-cols-[110px_1fr] gap-x-4 gap-y-3 text-[15px]">
                            <dt className="text-[#5B6B7A]">Access</dt>
                            <dd className="text-[#16202B]">{ACCESS[ep.access].detail}</dd>
                            <dt className="text-[#5B6B7A]">Rate limit</dt>
                            <dd className="text-[#16202B]">{ep.limiter ? LIMITER[ep.limiter] : 'none on this route'}</dd>
                            <dt className="text-[#5B6B7A]">Validation</dt>
                            <dd className="text-[#16202B]">{ep.validation ? <code className="font-mono text-[13px]">{ep.validation}</code> : 'no schema middleware'}</dd>
                            <dt className="text-[#5B6B7A]">Handler</dt>
                            <dd className="font-mono text-[13px] text-[#16202B] break-words">{ep.handler}</dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    )
}
