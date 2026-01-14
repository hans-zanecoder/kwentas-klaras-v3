import type { RateLimitOptions } from '../../types/rateLimiter/rateLimiter'

export const RATE_LIMIT_CLEANUP_INTERVAL_MS = 60000

export const DEFAULT_RATE_LIMIT_OPTIONS: Required<RateLimitOptions> = {
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later',
  skipSuccessfulRequests: false,
}

export const STRICT_RATE_LIMIT_OPTIONS: Required<RateLimitOptions> = {
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later',
  skipSuccessfulRequests: false,
}
