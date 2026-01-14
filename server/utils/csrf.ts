import { randomBytes, createHash } from 'crypto'

import {
  CSRF_CLEANUP_INTERVAL_MS,
  CSRF_TOKEN_EXPIRY_MS,
  CSRF_TOKEN_LENGTH,
  CSRF_TOKEN_SECRET,
} from '../constants/csrf/csrf'
import type { CSRFToken } from '../types/csrf/csrfToken'

const tokenStore = new Map<string, CSRFToken>()

setInterval(() => {
  const now = Date.now()
  for (const [key, token] of tokenStore.entries()) {
    if (token.expiresAt < now) {
      tokenStore.delete(key)
    }
  }
}, CSRF_CLEANUP_INTERVAL_MS)

export function generateCSRFToken(sessionId: string): string {
  const randomToken = randomBytes(CSRF_TOKEN_LENGTH).toString('hex')
  const expiresAt = Date.now() + CSRF_TOKEN_EXPIRY_MS

  const token = createHash('sha256')
    .update(randomToken + CSRF_TOKEN_SECRET + sessionId)
    .digest('hex')

  tokenStore.set(sessionId, {
    token,
    expiresAt,
  })

  return randomToken
}

export function validateCSRFToken(sessionId: string, token: string): boolean {
  const stored = tokenStore.get(sessionId)

  if (!stored) {
    return false
  }

  if (stored.expiresAt < Date.now()) {
    tokenStore.delete(sessionId)
    return false
  }

  const expectedToken = createHash('sha256')
    .update(token + CSRF_TOKEN_SECRET + sessionId)
    .digest('hex')

  return stored.token === expectedToken
}

export function revokeCSRFToken(sessionId: string): void {
  tokenStore.delete(sessionId)
}

export function getCSRFToken(sessionId: string): string | null {
  const stored = tokenStore.get(sessionId)
  if (!stored || stored.expiresAt < Date.now()) {
    return null
  }
  return stored.token
}
