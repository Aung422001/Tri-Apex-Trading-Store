import Redis from 'ioredis'
import { env } from './env'

let redis: Redis | null = null

// No REDIS_URL means no cache at all. Construct nothing in that case —
// otherwise every cacheGet pays for a refused TCP connection before falling
// through to the database.
if (!env.REDIS_URL) {
    console.log('ℹ️  REDIS_URL not set — running without cache')
} else {
    try {
        redis = new Redis(env.REDIS_URL, {
            maxRetriesPerRequest: 3,
            retryStrategy(times) {
                if (times > 3) {
                    console.warn('⚠️ Redis connection failed, running without cache')
                    return null
                }
                return Math.min(times * 200, 2000)
            },
            lazyConnect: true,
        })

        // ioredis re-emits on every retry and connection errors often carry an
        // empty message — log once, with a code to actually identify the failure.
        let errorLogged = false
        redis.on('error', (err: NodeJS.ErrnoException) => {
            if (errorLogged) return
            errorLogged = true
            console.warn('⚠️ Redis error:', err.message || err.code || String(err))
        })

        redis.on('connect', () => {
            errorLogged = false
            console.log('✅ Redis connected')
        })
    } catch (err) {
        console.warn('⚠️ Redis not available, running without cache')
    }
}

/** Cache helper — get from cache or execute fn and cache the result */
export async function cacheGet<T>(
    key: string,
    fn: () => Promise<T>,
    ttl: number = env.REDIS_TTL_DEFAULT
): Promise<T> {
    if (!redis) return fn()

    try {
        const cached = await redis.get(key)
        if (cached) return JSON.parse(cached) as T
    } catch {
        // Cache miss or error — proceed to fetch
    }

    const result = await fn()

    try {
        if (redis) {
            await redis.set(key, JSON.stringify(result), 'EX', ttl)
        }
    } catch {
        // Silently fail cache write
    }

    return result
}

/** Invalidate cache keys matching a pattern */
export async function cacheInvalidate(pattern: string): Promise<void> {
    if (!redis) return
    try {
        const keys = await redis.keys(pattern)
        if (keys.length > 0) {
            await redis.del(...keys)
        }
    } catch {
        // Silently fail
    }
}

export { redis }
export default redis
