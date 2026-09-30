import Link from 'next/link'
import { Package, Mail, Phone, MapPin, ArrowRight } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-navy-dark text-white border-t-4 border-orange">
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-orange flex items-center justify-center border-2 border-orange">
                                <Package className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <div className="font-display font-[900] text-2xl leading-none tracking-tight uppercase">TRIAPEX</div>
                                <div className="text-[10px] text-orange tracking-[0.2em] font-bold mt-1 leading-none uppercase">TRADING GROUP</div>
                            </div>
                        </div>
                        <p className="text-white/70 text-sm leading-relaxed mb-8">
                            Myanmar&apos;s leading 3D printer retailer. Quality products, expert support, fast delivery. Built for makers, by the makers.
                        </p>

                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-display font-bold text-xl uppercase tracking-wider text-orange mb-6">Shop</h3>
                        <ul className="space-y-4">
                            {[
                                { label: 'FDM Printers', href: '/products?category=fdm-printers' },
                                { label: 'Resin Printers', href: '/products?category=resin-printers' },
                                { label: 'Filaments', href: '/products?category=filaments' },
                                { label: 'Accessories', href: '/products?category=accessories' },
                                { label: 'All Products', href: '/products' },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-white/70 hover:text-white hover:pl-2 border-l-2 border-transparent hover:border-orange text-sm font-medium transition-all duration-200">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-display font-bold text-xl uppercase tracking-wider text-orange mb-6">Support</h3>
                        <ul className="space-y-4">
                            {[
                                { label: 'Help Center', href: '/contact' },
                                { label: 'Shipping Policy', href: '/contact' },
                                { label: 'Return Policy', href: '/contact' },
                                { label: 'FAQ', href: '/contact' },
                                { label: 'Blog', href: '/blog' },
                            ].map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-white/70 hover:text-white hover:pl-2 border-l-2 border-transparent hover:border-orange text-sm font-medium transition-all duration-200">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact & Newsletter */}
                    <div>
                        <h3 className="font-display font-bold text-xl uppercase tracking-wider text-orange mb-6">Contact Us</h3>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-4 text-sm text-white/80">
                                <MapPin className="w-5 h-5 mt-0.5 text-orange flex-shrink-0" />
                                <span className="leading-relaxed">No.612, Shin Htwe Nyo Street, Maung Makan Thar Main Road, East Dagon Township, Yangon, Myanmar</span>
                            </li>
                            <li className="flex items-center gap-4 text-sm text-white/80">
                                <Phone className="w-5 h-5 text-orange flex-shrink-0" />
                                <span className="font-mono">+95 944 999 7080</span>
                            </li>
                            <li className="flex items-center gap-4 text-sm text-white/80">
                                <Mail className="w-5 h-5 text-orange flex-shrink-0" />
                                <span>kht@triapextradinggroupmm.com</span>
                            </li>
                        </ul>

                        {/* Newsletter */}
                        <div>
                            <h4 className="font-display font-bold text-lg uppercase tracking-wider text-white mb-3">Stay in the loop</h4>
                            <div className="flex border-b border-white/20 hover:border-orange transition-colors">
                                <input
                                    type="email"
                                    placeholder="YOUR EMAIL"
                                    className="flex-1 bg-transparent px-0 py-3 text-sm text-white outline-none min-w-0 font-medium placeholder:font-bold placeholder:text-white/30"
                                />
                                <button className="px-2 text-orange hover:text-white transition-colors" aria-label="Subscribe">
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="font-mono text-white/40 text-xs uppercase tracking-widest">© {new Date().getFullYear()} Triapex Trading Group. All rights reserved.</p>
                    <div className="flex gap-8 text-white/40 text-xs font-bold uppercase tracking-wider">
                        <Link href="/showcase" className="hover:text-white hover:underline transition-colors">Project Showcase</Link>
                        <Link href="/privacy"className="hover:text-white hover:underline transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white hover:underline transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
