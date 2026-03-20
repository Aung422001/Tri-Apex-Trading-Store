import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="text-center">
                <div className="text-8xl font-bold text-gradient mb-4">404</div>
                <h1 className="text-2xl font-bold text-primary mb-3">Page Not Found</h1>
                <p className="text-gray-500 mb-6 max-w-md">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
                <Link href="/" className="btn-primary">Go Home</Link>
            </div>
        </div>
    )
}
