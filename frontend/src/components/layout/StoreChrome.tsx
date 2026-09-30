'use client'

import { usePathname } from 'next/navigation'

// Routes that render as their own standalone interface, without the store's
// navbar, footer, cart drawer and AI chat widget.
const STANDALONE_ROUTES = ['/showcase']

export default function StoreChrome({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const standalone = STANDALONE_ROUTES.some((route) => pathname === route || pathname?.startsWith(`${route}/`))

    if (standalone) return null
    return <>{children}</>
}
