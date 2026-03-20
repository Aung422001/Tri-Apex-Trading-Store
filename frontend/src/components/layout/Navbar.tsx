'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ShoppingCart, Search, Menu, X, ChevronDown } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const cartItems = useCartStore((s) => s.items)
    const toggleDrawer = useCartStore((s) => s.toggleDrawer)
    const user = useAuthStore((s) => s.user)
    const logout = useAuthStore((s) => s.logout)

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

    const navLinks = [
        { label: 'Products', href: '/products' },
        { label: 'FDM Printers', href: '/products?category=fdm-printers' },
        { label: 'Resin Printers', href: '/products?category=resin-printers' },
        { label: 'Filaments', href: '/products?category=filaments' },
        { label: 'Blog', href: '/blog' },
        { label: 'Contact', href: '/contact' },
    ]

    return (
        <header className="sticky top-0 z-50 glass border-b border-gray-200/50">
            {/* Top bar */}
            <div className="bg-primary text-white text-xs py-1.5">
                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                    <span>🚚 Free shipping on orders over MMK 50000</span>
                    <span className="hidden sm:block">📞 +95 944 999 7080 | kht@triapextradinggroupmm.com</span>
                </div>
            </div>

            {/* Main nav */}
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <Image
                            src="/logo.png"
                            width={40}
                            height={40}
                            alt="Triapex Trading Group Logo"
                            className="rounded-xl group-hover:scale-105 transition-transform"
                        />
                        <div className="hidden sm:block">
                            <div className="font-bold text-primary text-lg leading-tight">Triapex</div>
                            <div className="text-[10px] text-gray-500 -mt-0.5">TRADING GROUP</div>
                        </div>
                    </Link>

                    {/* Desktop nav links */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-accent rounded-lg hover:bg-accent/5 transition-all"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right side */}
                    <div className="flex items-center gap-2">
                        {/* Search */}
                        <button
                            onClick={() => setSearchOpen(!searchOpen)}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <Search className="w-5 h-5 text-gray-600" />
                        </button>

                        {/* Cart */}
                        <button
                            onClick={toggleDrawer}
                            className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <ShoppingCart className="w-5 h-5 text-gray-600" />
                            {totalItems > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-scale-in">
                                    {totalItems}
                                </span>
                            )}
                        </button>

                        {/* User */}
                        {user ? (
                            <div className="relative group">
                                <button className="flex items-center gap-1.5 p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                    <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">{user.name[0]}</span>
                                    </div>
                                    <ChevronDown className="w-3 h-3 text-gray-400" />
                                </button>
                                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1">
                                    <div className="px-3 py-2 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                    <Link href="/dashboard" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Dashboard</Link>
                                    <Link href="/dashboard/orders" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">My Orders</Link>
                                    {user.role === 'ADMIN' && (
                                        <Link href="/admin" className="block px-3 py-2 text-sm text-accent font-medium hover:bg-orange-50">Admin Panel</Link>
                                    )}
                                    <button onClick={logout} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50">Logout</button>
                                </div>
                            </div>
                        ) : (
                            <Link href="/login" className="btn-primary text-sm py-2 px-4">
                                Sign In
                            </Link>
                        )}

                        {/* Mobile menu toggle */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-xl"
                        >
                            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Search bar */}
            {searchOpen && (
                <div className="border-t border-gray-100 animate-slide-down">
                    <div className="max-w-7xl mx-auto px-4 py-3">
                        <form action="/products" className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                name="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search 3D printers, filaments, accessories..."
                                className="input-field pl-12 pr-4"
                                autoFocus
                            />
                        </form>
                    </div>
                </div>
            )}

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="lg:hidden border-t border-gray-100 animate-slide-down">
                    <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    )
}
