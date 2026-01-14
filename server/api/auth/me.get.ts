import { withErrorHandler } from '../../utils/errorHandler'
import { UserSerializer } from '../../serializers/UserSerializer'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  return await withErrorHandler(async () => {
    const user = await requireAuth(event)

    return {
      success: true,
      user: UserSerializer.formatUser(user)
    }
  }, {
    defaultStatusCode: 401,
    defaultMessage: 'Invalid token'
  })
})
