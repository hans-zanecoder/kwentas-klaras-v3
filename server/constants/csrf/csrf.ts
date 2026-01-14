export const CSRF_TOKEN_SECRET = process.env.CSRF_TOKEN_SECRET || 'change-this-secret-in-production'
export const CSRF_TOKEN_LENGTH = 32
export const CSRF_TOKEN_EXPIRY_MS = 60 * 60 * 1000
export const CSRF_CLEANUP_INTERVAL_MS = 60 * 60 * 1000
