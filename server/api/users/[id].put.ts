import { connectToMongoDB } from '../../lib/mongodb'
import User from '../../models/User'
import type { UpdateUserRequest } from '../../types/user/updateUserRequest'
import { withErrorHandler } from '../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'User ID is required'
    })
  }

  const body = await readBody<UpdateUserRequest>(event)

  return await withErrorHandler(async () => {
    await connectToMongoDB()

    const user = await User.findById(id)

    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      })
    }

    if (body.firstName !== undefined) {
      user.firstName = body.firstName.trim()
    }

    if (body.lastName !== undefined) {
      user.lastName = body.lastName.trim()
    }

    if (body.username !== undefined) {
      const username = body.username.startsWith('@') ? body.username : `@${body.username}`
      user.username = username.trim()
    }

    if (body.email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(body.email)) {
        throw createError({
          statusCode: 400,
          message: 'Invalid email format'
        })
      }
      user.email = body.email.toLowerCase().trim()
    }

    if (body.department !== undefined) {
      user.department = body.department
    }

    if (body.status !== undefined) {
      user.status = body.status
    }

    await user.save()

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
    defaultMessage: 'Failed to update user'
  })
})

