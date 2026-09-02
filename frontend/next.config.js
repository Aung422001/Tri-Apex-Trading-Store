/** @type {import('next').NextConfig} */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// The CSP has to name the API's real origin, which differs per environment.
// Hardcoding localhost here silently blocks every fetch once deployed.
const originOf = (url) => {
    try {
        return new URL(url).origin
    } catch {
        return ''
    }
}

const connectSrc = ["'self'", originOf(API_URL), originOf(APP_URL)]
    .filter(Boolean)
    .filter((value, i, all) => all.indexOf(value) === i)
    .join(' ')

const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'res.cloudinary.com' },
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'placehold.co' },
        ],
        unoptimized: true,
    },
    env: {
        NEXT_PUBLIC_API_URL: API_URL,
        NEXT_PUBLIC_APP_URL: APP_URL,
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
                            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                            "font-src 'self' https://fonts.gstatic.com",
                            "img-src 'self' data: res.cloudinary.com images.unsplash.com placehold.co",
                            `connect-src ${connectSrc}`,
                        ].join('; ') + ';',
                    },
                ],
            },
        ]
    },
}

module.exports = nextConfig
