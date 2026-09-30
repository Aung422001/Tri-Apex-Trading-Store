import type { Metadata } from 'next'
import Link from 'next/link'
import {
    ArrowRight, ArrowUpRight, Bot, Boxes, CreditCard, Database, GitBranch, Globe, Layers,
    LayoutDashboard, Lock, MessageSquare, PackageSearch, Search, Server, ShieldCheck,
    ShoppingCart, Sparkles, Truck, Zap,
} from 'lucide-react'

export const metadata: Metadata = {
    title: 'Project Showcase',
    description: 'Case study of the Triapex Trading Group platform — a full-stack, AI-assisted e-commerce store for 3D printers built with Next.js, Express, Prisma and PostgreSQL.',
}

const REPO_URL = 'https://github.com/aung422001/tri-apex-trading-store'

const stats = [
    { value: '8', label: 'API modules' },
    { value: '18', label: 'Data models' },
    { value: '6', label: 'AI endpoints' },
    { value: '23', label: 'App pages' },
]

const features = [
    {
        icon: PackageSearch,
        title: 'Product Catalog',
        desc: 'Category and brand filtering, slug-based product pages, image galleries, variants and paginated listings.',
    },
    {
        icon: ShoppingCart,
        title: 'Cart & Checkout',
        desc: 'Persistent cart with a slide-out drawer, coupon-ready order model and Stripe payment intents with webhook confirmation.',
    },
    {
        icon: Truck,
        title: 'Order Tracking',
        desc: 'Public tracking by order number, plus a customer dashboard with order history, detail views and cancellation.',
    },
    {
        icon: Lock,
        title: 'Authentication',
        desc: 'JWT access + refresh tokens in HTTP-only cookies, bcrypt hashing and an email-based password reset flow.',
    },
    {
        icon: LayoutDashboard,
        title: 'Admin Panel',
        desc: 'Role-guarded dashboard to create products, manage order status and review customer feedback.',
    },
    {
        icon: MessageSquare,
        title: 'AI Shopping Assistant',
        desc: 'Floating chat widget on every page that answers product and support questions in context.',
    },
]

const aiFeatures = [
    { endpoint: '/ai/recommend', title: 'Printer Recommender', desc: 'Matches budget, use case and experience level to the live catalog and returns three reasoned picks.' },
    { endpoint: '/ai/chat', title: 'Support Chatbot', desc: 'Conversational assistant powered by Claude, with graceful offline fallback when no key is configured.' },
    { endpoint: '/ai/compare', title: 'Product Comparison', desc: 'Side-by-side spec analysis of selected printers with a plain-language verdict.' },
    { endpoint: '/ai/price-compare', title: 'Price Comparison', desc: 'Scrapes market listings with Playwright + Cheerio and summarises how our pricing stacks up.' },
    { endpoint: '/ai/generate-description', title: 'Copy Generator', desc: 'Admin-only: drafts SEO-friendly product descriptions from specs using Gemini.' },
    { endpoint: '/ai/analyze-image', title: 'Image Analysis', desc: 'Admin-only: Gemini vision extracts product details from an uploaded photo.' },
]

const stack = [
    { group: 'Frontend', icon: Globe, items: ['Next.js 14 (App Router)', 'React 18', 'TypeScript', 'Tailwind CSS', 'Zustand', 'TanStack Query', 'Axios', 'Lucide Icons'] },
    { group: 'Backend', icon: Server, items: ['Node.js', 'Express', 'TypeScript', 'Zod validation', 'Helmet', 'express-rate-limit', 'Multer', 'Nodemailer'] },
    { group: 'Data', icon: Database, items: ['PostgreSQL', 'Prisma ORM', 'Redis cache (ioredis)', 'Migrations + seed scripts'] },
    { group: 'Integrations', icon: Sparkles, items: ['Anthropic Claude', 'Google Gemini', 'Stripe', 'Playwright', 'Cheerio'] },
    { group: 'DevOps', icon: GitBranch, items: ['Render Blueprint (IaC)', 'pnpm workspaces', 'Custom domains', 'Environment-driven CSP'] },
]

const highlights = [
    { icon: ShieldCheck, title: 'Security first', desc: 'Helmet headers, per-route rate limiting (auth, API, AI), Zod request validation, role-based authorisation middleware and a Content-Security-Policy generated from the deployed API origin.' },
    { icon: Layers, title: 'Layered backend', desc: 'Routes → controllers → services, with shared response and pagination helpers and a central error handler, keeping business logic testable and framework-free.' },
    { icon: Zap, title: 'Built for the free tier', desc: 'Deploys as a single Render blueprint — API, web app and Postgres — with pinned toolchains and heavy features (headless Chromium) switched off where memory is tight.' },
    { icon: Boxes, title: 'Rich data model', desc: 'Users, products, variants, images, brands, categories, carts, orders, addresses, reviews, wishlists, coupons, blog posts and feedback, all in one Prisma schema.' },
]

const pages = [
    { label: 'Home', href: '/', desc: 'Landing page & featured categories' },
    { label: 'Catalog', href: '/products', desc: 'Filterable product listing' },
    { label: 'Cart', href: '/cart', desc: 'Cart review & totals' },
    { label: 'Track Order', href: '/track-order', desc: 'Public order lookup' },
    { label: 'Blog', href: '/blog', desc: 'Guides & news' },
    { label: 'Contact', href: '/contact', desc: 'Feedback form' },
    { label: 'Login', href: '/login', desc: 'Customer & admin sign-in' },
    { label: 'Register', href: '/register', desc: 'Account creation' },
]

function SectionHeading({ label, title, accent }: { label: string; title: string; accent?: string }) {
    return (
        <div className="mb-12">
            <div className="font-mono text-label text-orange mb-4">{label}</div>
            <h2 className="font-display font-[900] text-display-md uppercase tracking-tight text-navy leading-none">
                {title} {accent && <span className="text-orange">{accent}</span>}
            </h2>
        </div>
    )
}

export default function ShowcasePage() {
    return (
        <div className="page-enter bg-canvas min-h-screen">
            {/* Hero */}
            <section className="relative bg-navy-dark overflow-hidden border-b-[8px] border-orange">
                <div className="absolute inset-0 bg-grain pointer-events-none" />
                <div className="absolute top-0 right-0 w-[55%] h-full bg-navy hidden md:block" style={{ clipPath: 'polygon(25% 0, 100% 0, 100% 100%, 0 100%)' }} />

                <div className="relative max-w-7xl mx-auto px-4 pt-20 pb-20 md:pt-28 md:pb-28 grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
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

            {/* Overview */}
            <section className="max-w-7xl mx-auto px-4 py-24 grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-1">
                    <SectionHeading label="01 — Overview" title="The" accent="Brief" />
                </div>
                <div className="lg:col-span-2 grid sm:grid-cols-3 gap-6">
                    {[
                        { k: 'Problem', v: 'A Yangon-based 3D printer reseller needed to move from chat-app orders to a real storefront customers could browse, buy from and track orders on.' },
                        { k: 'Solution', v: 'A custom Next.js storefront and Express API with a full order lifecycle, an admin back office and AI tools that help buyers pick the right machine.' },
                        { k: 'Role', v: 'End-to-end design and development: UI, API, database schema, AI integrations and cloud deployment.' },
                    ].map((item) => (
                        <div key={item.k} className="bg-white border-2 border-navy p-6 shadow-hard">
                            <div className="font-display font-bold text-2xl uppercase text-orange mb-3">{item.k}</div>
                            <p className="text-sm text-ink/80 leading-relaxed">{item.v}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="bg-white border-y-2 border-navy/10">
                <div className="max-w-7xl mx-auto px-4 py-24">
                    <SectionHeading label="02 — Features" title="What it" accent="Does" />
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-[2px] bg-navy/15 border-2 border-navy">
                        {features.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="group bg-white p-8 hover:bg-navy transition-colors">
                                <Icon className="w-10 h-10 text-orange mb-6" />
                                <h3 className="font-display font-bold text-2xl uppercase text-navy group-hover:text-white mb-3">{title}</h3>
                                <p className="text-sm text-ink/70 group-hover:text-white/70 leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI */}
            <section className="bg-navy-dark text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-grain pointer-events-none" />
                <div className="relative max-w-7xl mx-auto px-4 py-24">
                    <div className="mb-12">
                        <div className="font-mono text-label text-orange mb-4">03 — AI Integration</div>
                        <h2 className="font-display font-[900] text-display-md uppercase tracking-tight leading-none text-white">
                            Two models, <span className="text-orange">one assistant</span>
                        </h2>
                        <p className="text-white/70 max-w-2xl mt-6">
                            Claude handles open-ended customer conversation while Gemini powers structured tasks — recommendations, comparisons, copywriting and vision. Every AI route sits behind its own rate limiter; admin tools are role-guarded.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {aiFeatures.map((f) => (
                            <div key={f.endpoint} className="border border-white/15 bg-white/[0.03] p-6 hover:border-orange transition-colors">
                                <div className="flex items-center gap-2 mb-4">
                                    <Bot className="w-5 h-5 text-orange" />
                                    <code className="font-mono text-xs text-orange/90">POST {f.endpoint}</code>
                                </div>
                                <h3 className="font-display font-bold text-2xl uppercase mb-2 text-white">{f.title}</h3>
                                <p className="text-sm text-white/65 leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Architecture */}
            <section className="max-w-7xl mx-auto px-4 py-24">
                <SectionHeading label="04 — Architecture" title="How it" accent="Fits" />
                <div className="bg-white border-2 border-navy p-6 md:p-10 shadow-hard">
                    <div className="grid md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-4 md:gap-6 items-stretch">
                        <ArchBox icon={Globe} title="Web App" sub="Next.js 14 · React · Tailwind" lines={['App Router pages', 'Zustand cart & auth', 'TanStack Query']} />
                        <ArchArrow label="REST /api/v1" />
                        <ArchBox icon={Server} title="API" sub="Express · TypeScript" lines={['Routes → Controllers → Services', 'JWT auth + RBAC', 'Zod + rate limiting']} highlight />
                        <ArchArrow label="Prisma / ioredis" />
                        <div className="grid gap-4">
                            <ArchBox icon={Database} title="PostgreSQL" sub="Primary store" lines={[]} compact />
                            <ArchBox icon={Zap} title="Redis" sub="Optional cache" lines={[]} compact />
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t-2 border-dashed border-navy/15">
                        <div className="font-mono text-label text-navy/50 mb-4">External services</div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { icon: MessageSquare, name: 'Anthropic Claude', role: 'Support chat' },
                                { icon: Sparkles, name: 'Google Gemini', role: 'Recs · vision · copy' },
                                { icon: CreditCard, name: 'Stripe', role: 'Payments + webhooks' },
                                { icon: Search, name: 'Playwright', role: 'Price scraping' },
                            ].map(({ icon: Icon, name, role }) => (
                                <div key={name} className="flex items-center gap-3 border-2 border-navy/10 p-3">
                                    <Icon className="w-6 h-6 text-orange flex-shrink-0" />
                                    <div className="min-w-0">
                                        <div className="font-bold text-sm text-navy truncate">{name}</div>
                                        <div className="text-xs text-ink/60 truncate">{role}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Tech stack */}
            <section className="bg-white border-y-2 border-navy/10">
                <div className="max-w-7xl mx-auto px-4 py-24">
                    <SectionHeading label="05 — Tech Stack" title="Built" accent="With" />
                    <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                        {stack.map(({ group, icon: Icon, items }) => (
                            <div key={group} className="border-t-4 border-orange pt-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <Icon className="w-5 h-5 text-navy" />
                                    <h3 className="font-display font-bold text-xl uppercase text-navy">{group}</h3>
                                </div>
                                <ul className="flex flex-wrap gap-2">
                                    {items.map((item) => (
                                        <li key={item} className="font-mono text-xs bg-canvas border border-navy/15 text-navy px-2 py-1">{item}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Engineering highlights */}
            <section className="max-w-7xl mx-auto px-4 py-24">
                <SectionHeading label="06 — Engineering" title="Under the" accent="Hood" />
                <div className="grid md:grid-cols-2 gap-6">
                    {highlights.map(({ icon: Icon, title, desc }) => (
                        <div key={title} className="flex gap-5 bg-white border-2 border-navy/10 p-6 hover:border-navy transition-colors">
                            <div className="w-12 h-12 bg-navy flex items-center justify-center flex-shrink-0">
                                <Icon className="w-6 h-6 text-orange" />
                            </div>
                            <div>
                                <h3 className="font-display font-bold text-2xl uppercase text-navy mb-2">{title}</h3>
                                <p className="text-sm text-ink/70 leading-relaxed">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Explore pages */}
            <section className="bg-navy text-white">
                <div className="max-w-7xl mx-auto px-4 py-24">
                    <div className="mb-12">
                        <div className="font-mono text-label text-orange mb-4">07 — Explore</div>
                        <h2 className="font-display font-[900] text-display-md uppercase tracking-tight leading-none text-white">
                            Try it <span className="text-orange">live</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {pages.map((p) => (
                            <Link key={p.href} href={p.href} className="group flex items-center justify-between gap-4 border-2 border-white/15 p-5 hover:bg-orange hover:border-orange transition-colors">
                                <div className="min-w-0">
                                    <div className="font-display font-bold text-xl uppercase">{p.label}</div>
                                    <div className="text-xs text-white/60 group-hover:text-white/90 truncate">{p.desc}</div>
                                    <code className="font-mono text-[11px] text-orange group-hover:text-white">{p.href}</code>
                                </div>
                                <ArrowUpRight className="w-5 h-5 flex-shrink-0 text-white/40 group-hover:text-white" />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-7xl mx-auto px-4 py-24 text-center">
                <h2 className="font-display font-[900] text-display-md uppercase tracking-tight text-navy leading-none mb-6">
                    Like what you <span className="text-orange">see?</span>
                </h2>
                <p className="text-ink/70 max-w-xl mx-auto mb-10">
                    Browse the store, read the code, or get in touch to talk about a similar build.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <Link href="/products" className="inline-flex items-center gap-2 bg-orange text-white font-bold px-8 py-4 uppercase tracking-wider shadow-hard hover:bg-navy transition-colors">
                        Browse Products <ArrowRight className="w-5 h-5" />
                    </Link>
                    <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border-2 border-navy text-navy font-bold px-8 py-4 uppercase tracking-wider hover:bg-navy hover:text-white transition-colors">
                        View on GitHub <ArrowUpRight className="w-5 h-5" />
                    </a>
                    <Link href="/contact" className="inline-flex items-center gap-2 border-2 border-navy text-navy font-bold px-8 py-4 uppercase tracking-wider hover:bg-navy hover:text-white transition-colors">
                        Contact
                    </Link>
                </div>
            </section>
        </div>
    )
}

function ArchBox({ icon: Icon, title, sub, lines, highlight, compact }: {
    icon: typeof Globe
    title: string
    sub: string
    lines: string[]
    highlight?: boolean
    compact?: boolean
}) {
    return (
        <div className={`border-2 ${highlight ? 'border-orange bg-orange-50' : 'border-navy bg-canvas'} ${compact ? 'p-4' : 'p-5'} h-full`}>
            <div className="flex items-center gap-2 mb-1">
                <Icon className="w-5 h-5 text-orange" />
                <div className="font-display font-bold text-xl uppercase text-navy">{title}</div>
            </div>
            <div className="font-mono text-xs text-navy/60 mb-3">{sub}</div>
            {lines.length > 0 && (
                <ul className="space-y-1">
                    {lines.map((l) => (
                        <li key={l} className="text-sm text-ink/80 flex gap-2"><span className="text-orange">▸</span>{l}</li>
                    ))}
                </ul>
            )}
        </div>
    )
}

function ArchArrow({ label }: { label: string }) {
    return (
        <div className="flex md:flex-col items-center justify-center gap-2 text-navy/50">
            <ArrowRight className="w-6 h-6 rotate-90 md:rotate-0 text-orange" />
            <span className="font-mono text-[11px] whitespace-nowrap">{label}</span>
        </div>
    )
}
