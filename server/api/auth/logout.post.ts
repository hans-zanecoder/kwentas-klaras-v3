import { IS_PRODUCTION } from '../../constants/environment'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'session_token', {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: 'strict',
    path: '/',
  })

  return {
    success: true,
    message: 'Logged out successfully',
  }
})
