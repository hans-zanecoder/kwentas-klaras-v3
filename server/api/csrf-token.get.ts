import { generateCSRFTokenForSession } from '../utils/csrfMiddleware'

export default defineEventHandler(async (event) => {
  const token = generateCSRFTokenForSession(event)
  
  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Session required to generate CSRF token'
    })
  }

  return {
    success: true,
    csrfToken: token,
  }
})
