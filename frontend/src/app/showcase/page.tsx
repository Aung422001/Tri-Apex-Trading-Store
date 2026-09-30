import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Boxes } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Project Showcase',
    description: 'Triapex Trading Group — a full-stack, AI-assisted e-commerce store for 3D printers built with Next.js, Express, Prisma and PostgreSQL.',
}

const REPO_URL = 'https://github.com/aung422001/tri-apex-trading-store'

const stats = [
    { value: '8', label: 'API modules' },
    { value: '18', label: 'Data models' },
    { value: '6', label: 'AI endpoints' },
    { value: '23', label: 'App pages' },
]

export default function ShowcasePage() {
    return (
        <div className="page-enter min-h-[100svh] flex flex-col bg-navy-dark">
            {/* Hero */}
            <section className="relative flex-1 flex items-center bg-navy-dark overflow-hidden border-b-[8px] border-orange">
                <div className="absolute inset-0 bg-grain pointer-events-none" />
                <div className="absolute top-0 right-0 w-[55%] h-full bg-navy hidden md:block" style={{ clipPath: 'polygon(25% 0, 100% 0, 100% 100%, 0 100%)' }} />

                <div className="relative w-full max-w-7xl mx-auto px-4 py-12 md:py-20 grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
                    <div className="animate-slide-up-fade">
                        <div className="inline-flex items-center gap-2 border border-orange/60 text-orange font-mono text-label px-3 py-2 mb-8">
                            <span className="w-2 h-2 bg-orange" /> Portfolio · Case Study
                        </div>
                        <h1 className="font-display font-[900] text-display-lg uppercase tracking-tighter leading-[0.9] text-white mb-8">
                            Triapex<br />
                            <span className="text-orange">Trading</span> Store
                        </h1>
                        <p className="text-white/80 text-lg md:text-xl max-w-xl mb-10 border-l-4 border-orange pl-6">
                            A production full-stack e-commerce platform for 3D printers, filaments and accessories in Myanmar — with AI-powered recommendations, comparisons and customer support.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/" className="inline-flex items-center gap-2 bg-orange text-white font-bold px-8 py-4 uppercase tracking-wider hover:bg-white hover:text-navy transition-colors">
                                View Live Store <ArrowRight className="w-5 h-5" />
                            </Link>
                            <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border-2 border-white text-white font-bold px-8 py-4 uppercase tracking-wider hover:bg-white hover:text-navy transition-colors">
                                Source Code <ArrowUpRight className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Browser mock */}
                    <div className="animate-slide-up-fade hidden md:block" style={{ animationDelay: '200ms' }}>
                        <div className="bg-white border-2 border-white shadow-hard-orange">
                            <div className="flex items-center gap-2 px-4 py-3 bg-canvas border-b-2 border-navy/10">
                                <span className="w-3 h-3 rounded-full bg-danger" />
                                <span className="w-3 h-3 rounded-full bg-warning" />
                                <span className="w-3 h-3 rounded-full bg-success" />
                                <span className="ml-3 flex-1 font-mono text-xs text-navy/60 bg-white border border-navy/10 px-3 py-1 truncate">triapextradinggroupmm.com</span>
                            </div>
                            <div className="bg-navy-dark p-6 relative overflow-hidden">
                                <div className="font-display font-[900] text-4xl uppercase leading-[0.9] mb-4">
                                    <span className="text-orange block">Precision</span>
                                    <span className="text-white block">3D Printing</span>
                                </div>
                                <div className="h-2 w-2/3 bg-white/20 mb-2" />
                                <div className="h-2 w-1/2 bg-white/20 mb-6" />
                                <div className="inline-block bg-orange text-white text-xs font-bold px-4 py-2 uppercase tracking-wider">Enter Catalog</div>
                            </div>
                            <div className="grid grid-cols-3 gap-3 p-4">
                                {[0, 1, 2].map((i) => (
                                    <div key={i} className="border-2 border-navy/10">
                                        <div className="aspect-square bg-navy-50 flex items-center justify-center">
                                            <Boxes className="w-8 h-8 text-navy/30" />
                                        </div>
                                        <div className="p-2 space-y-1">
                                            <div className="h-1.5 w-full bg-navy/15" />
                                            <div className="h-1.5 w-1/2 bg-orange/60" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="bg-navy text-white border-b-2 border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((s) => (
                        <div key={s.label} className="border-l-4 border-orange pl-5">
                            <div className="font-mono text-4xl font-bold text-orange">{s.value}</div>
                            <div className="font-bold text-xs uppercase tracking-widest text-white/70 mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
