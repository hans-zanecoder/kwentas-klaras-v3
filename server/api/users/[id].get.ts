import { connectToMongoDB } from '../../lib/mongodb'
import User from '../../models/User'
import { withErrorHandler } from '../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'User ID is required'
    })
  }

  return await withErrorHandler(async () => {
    await connectToMongoDB()

    const user = await User.findById(id).lean()

    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      })
    }

    return {
      success: true,
      user: {
        id: user._id.toString(),
        firebaseId: user.firebaseId,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        department: user.department,
        status: user.status,
        joined: user.joined ? new Date(user.joined).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : undefined,
      }
    }
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to fetch user'
  })
})

