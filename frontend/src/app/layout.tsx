import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AIChatWidget from '@/components/shared/AIChatWidget'
import CartDrawer from '@/components/shared/CartDrawer'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
    title: {
        default: 'Triapex Trading Group — 3D Printer Solutions',
        template: '%s | Triapex Trading Group',
    },
    description: 'Malaysia\'s leading 3D printer retailer. Shop FDM, SLA & resin printers, filaments, and accessories from top brands like Bambu Lab, Creality, Prusa, and more.',
    keywords: ['3D printer', 'Malaysia', 'Bambu Lab', 'Creality', 'filament', 'FDM', 'SLA', 'resin printer'],
    icons: {
        icon: '/logo.png',
        shortcut: '/logo.png',
        apple: '/logo.png',
    },
    openGraph: {
        title: 'Triapex Trading Group — 3D Printer Solutions',
        description: 'Professional 3D printing solutions in Malaysia',
        type: 'website',
        locale: 'en_MY',
        siteName: 'Triapex Trading Group',
        images: [{ url: '/logo.png', width: 392, height: 392, alt: 'Triapex Trading Group Logo' }],
    },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="min-h-screen flex flex-col">
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: { borderRadius: '12px', background: '#1E3A5F', color: '#fff', fontSize: '14px' },
                        success: { iconTheme: { primary: '#22C55E', secondary: '#fff' } },
                        error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
                    }}
                />
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
                <CartDrawer />
                <AIChatWidget />
            </body>
        </html>
    )
}
