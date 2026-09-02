import Link from 'next/link'
import { ArrowRight, Shield, Truck, Headphones, CreditCard, Star, Printer, Droplets, Wrench, Package } from 'lucide-react'

export default function HomePage() {
    return (
        <div className="page-enter bg-canvas min-h-screen">
            {/* Hero Section */}
            <section className="relative w-full h-[90vh] min-h-[600px] bg-navy-dark overflow-hidden flex items-center border-b-[8px] border-orange">
                {/* Grain overlay */}
                <div className="absolute inset-0 bg-grain pointer-events-none z-10" />
                
                {/* Split geometric background accent */}
                <div className="absolute top-0 right-0 w-[60%] h-full bg-navy" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)' }} />

                {/* Abstract product background (using placeholder mix-blend styling) */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[50%] h-[80%] opacity-40 mix-blend-luminosity z-0 flex items-center justify-center">
                    <Printer className="w-[80%] h-[80%] text-navy-light opacity-50" />
                </div>

                <div className="max-w-7xl mx-auto px-4 w-full relative z-20">
                    <div className="max-w-3xl animate-slide-up-fade" style={{ animationDelay: '0ms' }}>
                        <h1 className="font-display font-[900] text-display-xl tracking-tighter leading-[0.85] text-white uppercase mb-8 flex flex-col">
                            <span className="text-orange block">PRECISION</span>
                            <span className="block text-white">3D PRINTING</span>
                            <span className="block" style={{ color: '#7FA8CC' }}>SOLUTIONS</span>
                        </h1>
                        <p className="text-white/80 font-body text-lg md:text-2xl max-w-xl mb-12 border-l-4 border-orange pl-6 animate-slide-up-fade" style={{ animationDelay: '160ms' }}>
                            From hobby to industrial — we stock the world's finest machines. Pure engineering. No compromises.
                        </p>
                        
                        <div className="flex animate-slide-up-fade" style={{ animationDelay: '320ms' }}>
                            <Link href="/products" className="bg-orange text-white font-bold px-12 py-5 text-lg uppercase tracking-wider hover:bg-white hover:text-navy transition-colors duration-300">
                                ENTER CATALOG
                            </Link>
                        </div>
                    </div>

                    {/* Stats badges floating */}
                    <div className="absolute bottom-12 right-12 hidden lg:flex gap-6 z-20 animate-slide-up-fade" style={{ animationDelay: '480ms' }}>
                        {[
                            { value: '500+', label: 'Products' },
                            { value: '2.5K', label: 'Makers' },
                            { value: '24/7', label: 'Support' },
                        ].map((stat) => (
                            <div key={stat.label} className="bg-white text-navy p-4 border-2 border-navy shadow-hard">
                                <div className="font-mono text-3xl font-bold text-orange">{stat.value}</div>
                                <div className="font-bold text-xs uppercase tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust Badges - Hard Grid */}
            <section className="bg-navy text-white border-b-2 border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10">
                        {[
                            { icon: <Truck className="w-8 h-8 text-orange" />, title: 'Free Shipping', desc: 'Over MMK 800K' },
                            { icon: <Shield className="w-8 h-8 text-orange" />, title: 'Full Warranty', desc: '1-Year Coverage' },
                            { icon: <Headphones className="w-8 h-8 text-orange" />, title: 'Expert Support', desc: 'Local Engineers' },
                            { icon: <CreditCard className="w-8 h-8 text-orange" />, title: 'Secure Pay', desc: 'Fully Encrypted' },
                        ].map((badge, i) => (
                            <div key={badge.title} className={`flex flex-col gap-3 ${i !== 0 ? 'pl-8' : ''}`}>
                                {badge.icon}
                                <div>
                                    <div className="font-bold text-sm uppercase tracking-wider">{badge.title}</div>
                                    <div className="text-xs text-white/50 font-mono mt-1">{badge.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Categories - Asymmetric */}
            <section className="py-24 max-w-7xl mx-auto px-4 relative">
                <div className="absolute left-0 top-1/2 w-4 h-32 bg-orange" />
                <h2 className="font-display font-[900] text-display-lg uppercase tracking-tight text-navy mb-16 pl-8 border-l-2 border-navy/10 leading-none">
                    ENGINEERED<br />FOR <span className="text-orange">YOU</span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* FDM (Large) */}
                    <Link href="/products?category=fdm-printers" className="group md:col-span-8 bg-navy p-12 hover:bg-orange transition-colors duration-300 relative overflow-hidden flex flex-col justify-end min-h-[400px]">
                        <div className="absolute right-[-10%] bottom-[-10%] transform group-hover:scale-110 transition-transform duration-500 opacity-20">
                            <Printer className="w-[400px] h-[400px] text-white" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="font-display font-bold text-6xl uppercase text-white mb-2">FDM Printers</h3>
                            <p className="text-white/80 font-mono uppercase text-sm tracking-widest flex items-center gap-2">
                                Explorer Series <ArrowRight className="w-4 h-4" />
                            </p>
                        </div>
                    </Link>

                    {/* Resin (Tall) */}
                    <Link href="/products?category=resin-printers" className="group md:col-span-4 bg-navy-dark p-12 hover:bg-orange transition-colors duration-300 relative overflow-hidden flex flex-col justify-end min-h-[400px]">
                        <Droplets className="absolute right-[-20%] top-[-10%] w-[300px] h-[300px] text-white/10 group-hover:rotate-12 transition-transform duration-500" />
                        <div className="relative z-10">
                            <h3 className="font-display font-bold text-4xl uppercase text-white mb-2">Resin</h3>
                            <p className="text-white/80 font-mono uppercase text-sm tracking-widest flex items-center gap-2">
                                Detail Masters <ArrowRight className="w-4 h-4" />
                            </p>
                        </div>
                    </Link>

                    {/* Filaments (Wide) */}
                    <Link href="/products?category=filaments" className="group md:col-span-6 border-4 border-navy p-12 hover:bg-navy hover:text-white transition-colors duration-300 min-h-[300px] flex flex-col justify-end relative">
                        <Package className="absolute right-8 top-8 w-16 h-16 text-navy/20 group-hover:text-white/20 transition-colors" />
                        <h3 className="font-display font-bold text-4xl uppercase mb-2">Materials</h3>
                        <p className="font-mono uppercase text-sm tracking-widest text-navy group-hover:text-white/80 flex items-center gap-2">
                            PLA / PETG / ABS <ArrowRight className="w-4 h-4" />
                        </p>
                    </Link>

                    {/* Accessories (Wide) */}
                    <Link href="/products?category=accessories" className="group md:col-span-6 bg-canvas border-4 border-navy p-12 hover:bg-orange hover:border-orange hover:text-white transition-colors duration-300 min-h-[300px] flex flex-col justify-end relative">
                        <Wrench className="absolute right-8 top-8 w-16 h-16 text-navy/20 group-hover:text-white/20 transition-colors" />
                        <h3 className="font-display font-bold text-4xl uppercase mb-2">Tooling</h3>
                        <p className="font-mono uppercase text-sm tracking-widest text-navy group-hover:text-white/80 flex items-center gap-2">
                            Upgrades & Parts <ArrowRight className="w-4 h-4" />
                        </p>
                    </Link>
                </div>
            </section>

            {/* Industrial Banner - Break Grid */}
            <section className="bg-orange text-navy-dark w-full py-24 my-20">
                <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
                    <h2 className="font-display font-[900] text-display-md uppercase tracking-tight mb-8">
                        INDUSTRIAL GRADE DEPLOYMENTS
                    </h2>
                    <p className="font-body font-medium text-lg max-w-2xl mb-12">
                        Get professional-grade 3D printing solutions for your business. From rapid prototyping to small batch manufacturing.
                    </p>
                    <Link href="/contact" className="border-4 border-navy-dark text-navy-dark font-bold px-10 py-4 uppercase tracking-widest hover:bg-navy-dark hover:text-orange transition-colors">
                        REQUEST QUOTE
                    </Link>
                </div>
            </section>

            {/* Newsletter - Stark Block */}
            <section className="bg-navy text-white border-y-[16px] border-navy-dark">
                <div className="max-w-4xl mx-auto px-4 py-32 text-center">
                    <h2 className="font-display font-[900] text-6xl uppercase tracking-tight mb-6">
                        SIGNAL INTERCEPT
                    </h2>
                    <p className="font-mono text-sm text-white/50 mb-12 uppercase tracking-widest">
                        Subscribe for technical updates & release drops. No spam.
                    </p>
                    <form className="flex flex-col sm:flex-row shadow-hard">
                        <input
                            type="email"
                            placeholder="OPERATOR EMAIL"
                            className="flex-1 bg-white px-6 py-4 text-navy font-bold placeholder:text-navy/30 focus:outline-none uppercase tracking-wider"
                        />
                        <button className="bg-orange text-white font-bold px-10 py-4 uppercase tracking-widest hover:bg-navy-dark transition-colors border-l-4 border-navy-dark sm:border-l-0">
                            TRANSMIT
                        </button>
                    </form>
                </div>
            </section>
        </div>
    )
}
