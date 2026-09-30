import type { Metadata } from 'next'
import { Barlow_Condensed, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AIChatWidget from '@/components/shared/AIChatWidget'
import CartDrawer from '@/components/shared/CartDrawer'
import StoreChrome from '@/components/layout/StoreChrome'
import { Toaster } from 'react-hot-toast'

const barlowCondensed = Barlow_Condensed({
    subsets: ['latin'],
    weight: ['700', '900'],
    variable: '--font-display',
})

const ibmPlexSans = IBM_Plex_Sans({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-body',
})

const ibmPlexMono = IBM_Plex_Mono({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-mono',
})

export const metadata: Metadata = {
    title: {
        default: 'Triapex Trading Group — 3D Printer Solutions',
        template: '%s | Triapex Trading Group',
    },
    description: 'Myanmar\'s leading 3D printer retailer. Shop FDM, SLA & resin printers, filaments, and accessories from top brands like Bambu Lab, Creality, Prusa, and more.',
    keywords: ['3D printer', 'Myanmar', 'Bambu Lab', 'Creality', 'filament', 'FDM', 'SLA', 'resin printer'],
    icons: {
        icon: '/logo.png',
        shortcut: '/logo.png',
        apple: '/logo.png',
    },
    openGraph: {
        title: 'Triapex Trading Group — 3D Printer Solutions',
        description: 'Professional 3D printing solutions in Myanmar',
        type: 'website',
        locale: 'en_MM',
        siteName: 'Triapex Trading Group',
        images: [{ url: '/logo.png', width: 392, height: 392, alt: 'Triapex Trading Group Logo' }],
    },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${barlowCondensed.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}>
            <body className="font-body min-h-screen flex flex-col antialiased selection:bg-orange selection:text-white">
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: { borderRadius: '2px', background: '#0D1B2E', color: '#fff', fontSize: '14px', border: '1px solid rgba(255,255,255,0.1)' },
                        success: { iconTheme: { primary: '#F97316', secondary: '#fff' } },
                        error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
                    }}
                />
                <StoreChrome><Navbar /></StoreChrome>
                <main className="flex-1">{children}</main>
                <StoreChrome>
                    <Footer />
                    <CartDrawer />
                    <AIChatWidget />
                </StoreChrome>
            </body>
        </html>
    )
}
