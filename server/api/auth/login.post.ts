import { getFirebaseAuth } from '../../lib/firebase'
import { withErrorHandler } from '../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  const { idToken } = await readBody(event)

  if (!idToken) {
    throw createError({
      statusCode: 400,
      message: 'ID token is required'
    })
  }

  return await withErrorHandler(async () => {
    const firebaseAuth = getFirebaseAuth()
    const decodedToken = await firebaseAuth.verifyIdToken(idToken)

    const sessionToken = crypto.randomUUID()
    setCookie(event, 'session_token', sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7
    })

    return {
      success: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
      }
    }
  }, {
    defaultStatusCode: 401,
    defaultMessage: 'Invalid ID token'
  })
})
