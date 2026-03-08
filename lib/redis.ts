import { Redis } from '@upstash/redis'

// Returns null if Redis is not configured (local dev without Redis)
function createRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) {
    console.warn('[Redis] UPSTASH env vars not set — caching disabled')
    return null
  }
  return new Redis({ url, token })
}

export const redis = createRedisClient()

/**
 * Cache-through helper. Returns cached value if fresh, otherwise calls fetcher,
 * caches result, and returns it. Falls back to fetcher if Redis is unavailable.
 */
export async function cached<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  if (!redis) return fetcher()

  try {
    const hit = await redis.get<T>(key)
    if (hit !== null && hit !== undefined) return hit
  } catch (e) {
    console.warn(`[Redis] Cache read failed for ${key}:`, e)
  }

  const data = await fetcher()

  try {
    await redis.set(key, JSON.stringify(data), { ex: ttlSeconds })
  } catch (e) {
    console.warn(`[Redis] Cache write failed for ${key}:`, e)
  }

  return data
}
