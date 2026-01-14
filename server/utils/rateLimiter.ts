import { getRequestIP } from 'h3'
import type { H3Event } from 'h3'

import {
  DEFAULT_RATE_LIMIT_OPTIONS,
  RATE_LIMIT_CLEANUP_INTERVAL_MS,
  STRICT_RATE_LIMIT_OPTIONS,
} from '../constants/rateLimiter/rateLimiter'
import type { RateLimitOptions, RateLimitStore } from '../types/rateLimiter/rateLimiter'

const store: RateLimitStore = {}

setInterval(() => {
  const now = Date.now()
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key]
    }
  }
}, RATE_LIMIT_CLEANUP_INTERVAL_MS)

export function createRateLimiter(options: RateLimitOptions = {}) {
  const opts = { ...DEFAULT_RATE_LIMIT_OPTIONS, ...options }

  return async (event: H3Event): Promise<void> => {
    const requestIP = getRequestIP(event, { xForwardedFor: true })
    const clientId = requestIP || 'unknown'
    const key = `rate_limit:${clientId}`
    const now = Date.now()

    if (!store[key] || store[key].resetTime < now) {
      store[key] = {
        count: 0,
        resetTime: now + opts.windowMs,
      }
    }

    store[key].count++

    if (store[key].count > opts.max) {
      const retryAfter = Math.ceil((store[key].resetTime - now) / 1000)
      event.node.res.setHeader('Retry-After', retryAfter.toString())
      event.node.res.setHeader('X-RateLimit-Limit', opts.max.toString())
      event.node.res.setHeader('X-RateLimit-Remaining', '0')
      event.node.res.setHeader('X-RateLimit-Reset', store[key].resetTime.toString())

      throw createError({
        statusCode: 429,
        message: opts.message,
      })
    }

    event.node.res.setHeader('X-RateLimit-Limit', opts.max.toString())
    event.node.res.setHeader('X-RateLimit-Remaining', Math.max(0, opts.max - store[key].count).toString())
    event.node.res.setHeader('X-RateLimit-Reset', store[key].resetTime.toString())
  }
}

export const rateLimiter = createRateLimiter()
export const strictRateLimiter = createRateLimiter(STRICT_RATE_LIMIT_OPTIONS)
