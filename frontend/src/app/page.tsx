import Link from 'next/link'
import { ArrowRight, Shield, Truck, Headphones, CreditCard, Star, Printer, Droplets, Wrench, Package } from 'lucide-react'

export default function HomePage() {
    return (
        <div className="page-enter">
            {/* Hero Section */}
            <section className="gradient-primary text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 right-20 w-72 h-72 bg-accent rounded-full blur-[120px]" />
                    <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-400 rounded-full blur-[100px]" />
                </div>
                <div className="max-w-7xl mx-auto px-4 py-20 lg:py-28 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="animate-slide-up">
                            <span className="badge-accent text-sm mb-4 inline-block">🇲🇾 Malaysia&apos;s #1 3D Printer Store</span>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                                Precision <span className="text-gradient">3D Printing</span> Solutions
                            </h1>
                            <p className="text-white/80 text-lg md:text-xl mb-8 max-w-xl leading-relaxed">
                                From hobby to industrial — we carry the world&apos;s best 3D printers, filaments, and accessories. Expert support, fast shipping, unbeatable prices.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link href="/products" className="btn-primary text-base py-3.5 px-8 flex items-center gap-2">
                                    Shop Now <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link href="/products" className="border-2 border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-all">
                                    View Catalog
                                </Link>
                            </div>
                        </div>

                        {/* Hero right — stats */}
                        <div className="hidden lg:grid grid-cols-2 gap-4 animate-fade-in">
                            {[
                                { value: '500+', label: 'Products', icon: '📦' },
                                { value: '2,000+', label: 'Happy Customers', icon: '😊' },
                                { value: '50+', label: 'Brands', icon: '🏷️' },
                                { value: '24/7', label: 'Expert Support', icon: '🛟' },
                            ].map((stat) => (
                                <div key={stat.label} className="glass rounded-2xl p-6 text-center bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 transition-all">
                                    <div className="text-3xl mb-2">{stat.icon}</div>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <div className="text-white/60 text-sm">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Badges */}
            <section className="py-8 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { icon: <Truck className="w-6 h-6 text-accent" />, title: 'Free Shipping', desc: 'On orders over MMK 500' },
                            { icon: <Shield className="w-6 h-6 text-accent" />, title: '1-Year Warranty', desc: 'On all printers' },
                            { icon: <Headphones className="w-6 h-6 text-accent" />, title: 'Expert Support', desc: '24/7 assistance' },
                            { icon: <CreditCard className="w-6 h-6 text-accent" />, title: 'Secure Payment', desc: 'SSL encrypted' },
                        ].map((badge) => (
                            <div key={badge.title} className="flex items-center gap-3 p-3">
                                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                    {badge.icon}
                                </div>
                                <div>
                                    <div className="font-semibold text-sm">{badge.title}</div>
                                    <div className="text-xs text-gray-500">{badge.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Categories */}
            <section className="py-16 lg:py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-primary mb-3">Shop by Category</h2>
                        <p className="text-gray-500 max-w-md mx-auto">Find the perfect 3D printing solution for your needs</p>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { name: 'FDM Printers', desc: 'Best for beginners & pros', icon: <Printer className="w-8 h-8" />, href: '/products?category=fdm-printers', color: 'from-blue-500 to-indigo-600' },
                            { name: 'Resin Printers', desc: 'Ultra-detailed prints', icon: <Droplets className="w-8 h-8" />, href: '/products?category=resin-printers', color: 'from-purple-500 to-pink-600' },
                            { name: 'Filaments', desc: 'PLA, PETG, TPU & more', icon: <Package className="w-8 h-8" />, href: '/products?category=filaments', color: 'from-accent to-orange-500' },
                            { name: 'Accessories', desc: 'Nozzles, beds & tools', icon: <Wrench className="w-8 h-8" />, href: '/products?category=accessories', color: 'from-green-500 to-emerald-600' },
                        ].map((cat) => (
                            <Link key={cat.name} href={cat.href} className="group card-hover p-6 text-center">
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.color} text-white flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                                    {cat.icon}
                                </div>
                                <h3 className="font-semibold text-primary mb-1">{cat.name}</h3>
                                <p className="text-xs text-gray-500">{cat.desc}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Promo Banner */}
            <section className="py-4">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="gradient-accent rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl" />
                            <div className="absolute bottom-0 left-10 w-60 h-60 bg-yellow-300 rounded-full blur-3xl" />
                        </div>
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold mb-3">Industrial Grade Printers Now Available! 🏭</h2>
                            <p className="text-white/90 mb-6 max-w-xl mx-auto">Get professional-grade 3D printing solutions for your business. Volume discounts available.</p>
                            <Link href="/products?featured=true" className="inline-flex items-center gap-2 bg-white text-accent font-semibold px-8 py-3 rounded-xl hover:bg-white/90 transition-all shadow-lg">
                                Shop Featured <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-16 lg:py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-primary mb-3">Why Choose Triapex?</h2>
                        <p className="text-gray-500 max-w-md mx-auto">Trusted by thousands of makers, businesses, and educators</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: 'Quality Products', desc: 'We only carry authorized, genuine products from top brands. Every printer is tested and verified before shipping.', icon: <Star className="w-7 h-7 text-accent" /> },
                            { title: 'Expert Support', desc: 'Our team of 3D printing experts provides free technical support, setup assistance, and troubleshooting help.', icon: <Headphones className="w-7 h-7 text-accent" /> },
                            { title: 'Fast Delivery', desc: 'Same-day dispatch for orders placed before 2PM. Free shipping on orders over MMK 500 with tracking.', icon: <Truck className="w-7 h-7 text-accent" /> },
                        ].map((item) => (
                            <div key={item.title} className="card p-8 text-center group hover:border-accent/20">
                                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-accent/20 transition-colors">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-primary mb-3">{item.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-16 gradient-primary">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-3">Stay Updated</h2>
                    <p className="text-white/70 mb-8 max-w-md mx-auto">Subscribe for exclusive deals, new product launches, and 3D printing tips.</p>
                    <form className="flex max-w-md mx-auto rounded-xl overflow-hidden shadow-xl">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-5 py-3.5 text-sm outline-none"
                        />
                        <button className="bg-accent hover:bg-accent-600 text-white font-semibold px-6 py-3.5 transition-colors whitespace-nowrap">
                            Subscribe
                        </button>
                    </form>
                </div>
            </section>
        </div>
    )
}
