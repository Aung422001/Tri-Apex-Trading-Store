import Link from 'next/link'
import { Calendar, ArrowRight, Clock } from 'lucide-react'

const blogPosts = [
    {
        slug: 'beginners-guide-to-3d-printing',
        title: 'Beginners Guide to 3D Printing',
        excerpt: 'Everything you need to know to get started with 3D printing, from choosing your first printer to making your first print.',
        date: '2024-11-15',
        readTime: '8 min',
        tag: 'Guide',
    },
    {
        slug: 'fdm-vs-resin-which-is-right-for-you',
        title: 'FDM vs Resin: Which is Right for You?',
        excerpt: 'Understanding the differences between FDM and resin 3D printing technologies to make the right purchase decision.',
        date: '2024-11-10',
        readTime: '6 min',
        tag: 'Comparison',
    },
    {
        slug: 'top-10-filaments-2024',
        title: 'Top 10 3D Printing Filaments for 2024',
        excerpt: 'Our picks for the best PLA, PETG, ABS, and specialty filaments this year, tested by our in-house team.',
        date: '2024-10-28',
        readTime: '10 min',
        tag: 'Review',
    },
]

export default function BlogPage() {
    return (
        <div className="page-enter">
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                    <h1 className="text-4xl font-bold text-primary mb-3">Blog & Resources</h1>
                    <p className="text-gray-500 max-w-md mx-auto">Printing guides, product comparisons, tips, and the latest in 3D printing</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post) => (
                        <Link key={post.slug} href={`/blog/${post.slug}`} className="card-hover overflow-hidden group">
                            <div className="h-48 bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center text-6xl">
                                📖
                            </div>
                            <div className="p-6">
                                <span className="badge-accent text-xs">{post.tag}</span>
                                <h2 className="text-lg font-bold text-primary mt-2 mb-2 group-hover:text-accent transition-colors">{post.title}</h2>
                                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{post.excerpt}</p>
                                <div className="flex items-center justify-between text-xs text-gray-400">
                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(post.date).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime} read</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
