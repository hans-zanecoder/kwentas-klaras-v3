export interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

export interface RateLimitOptions {
  windowMs?: number
  max?: number
  message?: string
  skipSuccessfulRequests?: boolean
}
