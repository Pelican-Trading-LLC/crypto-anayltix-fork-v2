import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

type RateLimitResult = {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

type RateLimiterLike = {
  limit: (identifier: string) => Promise<RateLimitResult>
}

let noOpWarned = false

function createNoOpLimiter(): RateLimiterLike {
  if (!noOpWarned) {
    console.warn('[rate-limit] Upstash not configured — rate limiting disabled')
    noOpWarned = true
  }
  return {
    async limit() {
      return {
        success: true,
        limit: 0,
        remaining: 0,
        reset: 0,
      }
    },
  }
}

function createRedisClient() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    return null
  }

  return new Redis({ url, token })
}

/**
 * Rate limiter for authenticated routes — keyed by user ID.
 */
export function createUserRateLimiter(prefix: string, requests: number, window: `${number} ${"ms" | "s" | "m" | "h" | "d"}` | `${number}${"ms" | "s" | "m" | "h" | "d"}`) {
  const redis = createRedisClient()
  if (!redis) return createNoOpLimiter()

  return new Ratelimit({
    redis,
    prefix: `ratelimit:${prefix}`,
    limiter: Ratelimit.slidingWindow(requests, window),
  })
}

/**
 * Rate limiter for unauthenticated routes — keyed by IP.
 */
export function createIpRateLimiter(prefix: string, requests: number, window: `${number} ${"ms" | "s" | "m" | "h" | "d"}` | `${number}${"ms" | "s" | "m" | "h" | "d"}`) {
  const redis = createRedisClient()
  if (!redis) return createNoOpLimiter()

  return new Ratelimit({
    redis,
    prefix: `ratelimit:${prefix}`,
    limiter: Ratelimit.slidingWindow(requests, window),
  })
}

/**
 * Extract client IP from request headers (works on Vercel)
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

/**
 * Standard rate limit exceeded response
 */
export function rateLimitResponse() {
  return new Response(
    JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
    { status: 429, headers: { 'Content-Type': 'application/json' } }
  )
}
