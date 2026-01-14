import { IS_PRODUCTION } from '../constants/environment'

export default defineEventHandler((event) => {
  if (!IS_PRODUCTION) {
    return
  }

  const protocol = getRequestURL(event).protocol
  const host = getHeader(event, 'host')
  const forwardedProto = getHeader(event, 'x-forwarded-proto')
  const forwardedHost = getHeader(event, 'x-forwarded-host')

  const isHttps = protocol === 'https:' || forwardedProto === 'https'
  const requestHost = host || forwardedHost

  if (!isHttps) {
    if (requestHost) {
      setHeader(event, 'Location', `https://${requestHost}${getRequestURL(event).pathname}`)
    }
    throw createError({
      statusCode: 301,
      message: 'HTTPS required'
    })
  }
})
