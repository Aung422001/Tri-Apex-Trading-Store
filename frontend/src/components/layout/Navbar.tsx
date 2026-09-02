'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { ShoppingCart, Search, Menu, X } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [isScrolled, setIsScrolled] = useState(false)
    const cartItems = useCartStore((s) => s.items)
    const toggleDrawer = useCartStore((s) => s.toggleDrawer)
    const user = useAuthStore((s) => s.user)
    const logout = useAuthStore((s) => s.logout)

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 80)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        { label: 'Products', href: '/products' },
        { label: 'FDM Printers', href: '/products?category=fdm-printers' },
        { label: 'Resin Printers', href: '/products?category=resin-printers' },
        { label: 'Filaments', href: '/products?category=filaments' },
        { label: 'Track Order', href: '/track-order' },
        { label: 'Blog', href: '/blog' },
        { label: 'Contact', href: '/contact' },
    ]

    const headerClass = isScrolled
        ? 'bg-navy text-white transition-colors duration-300'
        : 'bg-canvas text-navy transition-colors duration-300'

    return (
        <header className={`sticky top-0 z-50 border-b border-[rgba(30,58,95,0.12)] ${headerClass}`}>
            {/* Main nav */}
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/logo.png"
                            width={40}
                            height={40}
                            alt="Triapex Trading Group Logo"
                            className="rounded-none border-2 border-navy bg-white"
                        />
                        <div className="hidden sm:block">
                            <div className="font-display font-[900] text-2xl leading-none tracking-tight uppercase">
                                TRIAPEX
                            </div>
                            <div className="text-[10px] text-orange tracking-[0.2em] font-bold mt-1 leading-none uppercase">
                                TRADING GROUP
                            </div>
                        </div>
                    </Link>

                    {/* Desktop nav links */}
                    <nav className="hidden lg:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="relative text-sm font-medium pb-1 group"
                            >
                                {link.label}
                                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-orange origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                            </Link>
                        ))}
                    </nav>

                    {/* Right side */}
                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <button
                            onClick={() => setSearchOpen(!searchOpen)}
                            className="hover:text-orange transition-colors"
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        {/* Cart */}
                        <button
                            onClick={toggleDrawer}
                            className="relative hover:text-orange transition-colors"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 w-5 h-5 bg-navy border-2 border-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </button>

                        {/* User */}
                        {user ? (
                            <div className="relative group">
                                <button className="flex items-center gap-1.5 focus:outline-none">
                                    <div className={`w-8 h-8 flex items-center justify-center font-bold text-sm ${isScrolled ? 'bg-white text-navy' : 'bg-navy text-white'}`}>
                                        {user.name[0]}
                                    </div>
                                </button>
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white border-2 border-navy text-navy shadow-hard invisible group-hover:visible transition-all duration-200">
                                    <div className="px-4 py-3 border-b border-[rgba(30,58,95,0.12)]">
                                        <p className="text-sm font-bold uppercase">{user.name}</p>
                                        <p className="text-xs opacity-70">{user.email}</p>
                                    </div>
                                    <Link href="/dashboard" className="block px-4 py-2 text-sm hover:bg-orange hover:text-white font-bold uppercase tracking-wider">Dashboard</Link>
                                    <Link href="/dashboard/orders" className="block px-4 py-2 text-sm hover:bg-orange hover:text-white font-bold uppercase tracking-wider">My Orders</Link>
                                    {user.role === 'ADMIN' && (
                                        <Link href="/admin" className="block px-4 py-2 text-sm text-orange hover:bg-orange hover:text-white font-bold uppercase tracking-wider">Admin Panel</Link>
                                    )}
                                    <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-600 hover:text-white font-bold uppercase tracking-wider">Logout</button>
                                </div>
                            </div>
                        ) : (
                            <Link href="/login" className={`hidden lg:block border-2 ${isScrolled ? 'border-white hover:bg-white hover:text-navy' : 'border-navy hover:bg-navy hover:text-white'} text-sm font-bold px-4 py-2 uppercase tracking-wide transition-colors`}>
                                Sign In
                            </Link>
                        )}

                        {/* Mobile menu toggle */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="lg:hidden hover:text-orange"
                        >
                            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Search bar */}
            {searchOpen && (
                <div className="border-t border-[rgba(30,58,95,0.12)] bg-canvas text-navy absolute w-full animate-slide-down">
                    <div className="max-w-7xl mx-auto px-4 py-4">
                        <form action="/products" className="relative flex">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy opacity-50" />
                            <input
                                name="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="SEARCH CATALOG..."
                                className="w-full bg-transparent border-2 border-navy pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-orange font-bold uppercase"
                                autoFocus
                            />
                            <button type="submit" className="bg-orange text-white px-6 font-bold uppercase tracking-wider hover:bg-navy transition-colors">Search</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Full Screen Mobile menu */}
            {mobileOpen && (
                <div className="fixed inset-0 top-16 z-40 bg-navy text-white animate-slide-down overflow-y-auto">
                    <nav className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] gap-6 p-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="font-display font-bold text-4xl uppercase tracking-wider hover:text-orange transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                        {!user && (
                            <Link 
                                href="/login"
                                onClick={() => setMobileOpen(false)} 
                                className="mt-8 border-2 border-white px-8 py-3 font-display font-bold text-2xl uppercase tracking-wider hover:bg-white hover:text-navy transition-colors"
                            >
                                Sign In
                            </Link>
                        )}
                    </nav>
                </div>
            )}
        </header>
    )
}
