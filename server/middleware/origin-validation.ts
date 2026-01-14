import { IS_PRODUCTION } from '../constants/environment'

export default defineEventHandler((event) => {
  if (!IS_PRODUCTION) {
    return
  }

  const origin = getHeader(event, 'origin')
  const referer = getHeader(event, 'referer')
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || []

  if (allowedOrigins.length === 0) {
    return
  }

  const requestOrigin = origin || (referer ? new URL(referer).origin : null)

  if (!requestOrigin) {
    const method = getMethod(event)
    if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
      return
    }
    throw createError({
      statusCode: 403,
      message: 'Origin header required'
    })
  }

  const isAllowed = allowedOrigins.some(allowed => {
    if (allowed.includes('*')) {
      const pattern = allowed.replace(/\*/g, '.*')
      return new RegExp(`^${pattern}$`).test(requestOrigin)
    }
    return allowed === requestOrigin
  })

  if (!isAllowed) {
    throw createError({
      statusCode: 403,
      message: 'Origin not allowed'
    })
  }

  setHeader(event, 'Access-Control-Allow-Origin', requestOrigin)
  setHeader(event, 'Access-Control-Allow-Credentials', 'true')
  setHeader(event, 'Vary', 'Origin')
})
