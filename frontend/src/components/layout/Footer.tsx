import Link from 'next/link'
import { Package, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-primary text-white">
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 gradient-accent rounded-xl flex items-center justify-center">
                                <Package className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="font-bold text-lg">Triapex</div>
                                <div className="text-[10px] text-white/60 -mt-0.5">TRADING GROUP</div>
                            </div>
                        </div>
                        <p className="text-white/70 text-sm leading-relaxed mb-4">
                            Myanmar&apos;s leading 3D printer retailer. Quality products, expert support, fast delivery.
                        </p>
                        <div className="flex gap-3">
                            {['Facebook', 'Instagram', 'YouTube'].map((social) => (
                                <a
                                    key={social}
                                    href="#"
                                    className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent transition-colors text-xs font-medium"
                                >
                                    {social[0]}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Shop</h3>
                        <ul className="space-y-2.5">
                            {[
                                { label: 'FDM Printers', href: '/products?category=fdm-printers' },
                                { label: 'Resin Printers', href: '/products?category=resin-printers' },
                                { label: 'Filaments', href: '/products?category=filaments' },
                                { label: 'Accessories', href: '/products?category=accessories' },
                                { label: 'All Products', href: '/products' },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-white/70 hover:text-accent text-sm transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Support</h3>
                        <ul className="space-y-2.5">
                            {[
                                { label: 'Help Center', href: '/contact' },
                                { label: 'Shipping Policy', href: '/contact' },
                                { label: 'Return Policy', href: '/contact' },
                                { label: 'FAQ', href: '/contact' },
                                { label: 'Blog', href: '/blog' },
                            ].map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-white/70 hover:text-accent text-sm transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-sm text-white/70">
                                <MapPin className="w-4 h-4 mt-0.5 text-accent flex-shrink-0" />
                                <span>No.612, Shin Htwe Nyo Street, Maung Makan Thar Main Road, East Dagon Township, Yangon, Myanmar</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-white/70">
                                <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                                <span>+95 944 999 7080</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-white/70">
                                <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                                <span>kht@triapextradinggroupmm.com</span>
                            </li>
                        </ul>

                        {/* Newsletter */}
                        <div className="mt-6">
                            <p className="text-sm text-white/70 mb-2">Get deals & updates</p>
                            <div className="flex rounded-xl overflow-hidden">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="flex-1 px-3 py-2 text-sm text-gray-900 bg-white/90 outline-none min-w-0"
                                />
                                <button className="px-4 py-2 bg-accent hover:bg-accent-600 text-white text-sm font-medium transition-colors">
                                    Join
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-white/50 text-sm">© {new Date().getFullYear()} Triapex Trading Group. All rights reserved.</p>
                    <div className="flex gap-6 text-white/50 text-xs">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
