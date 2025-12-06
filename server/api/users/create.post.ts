import { getFirebaseAuth } from '../../lib/firebase'
import { connectToMongoDB } from '../../lib/mongodb'
import User from '../../models/User'
import type { CreateUserRequest } from '../../types/user/createUserRequest'
import { withErrorHandler } from '../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  const body = await readBody<CreateUserRequest>(event)

  if (!body.firstName || !body.lastName || !body.username || !body.email || !body.password || !body.department) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields: firstName, lastName, username, email, password, department'
    })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(body.email)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid email format'
    })
  }

  if (body.password.length < 6) {
    throw createError({
      statusCode: 400,
      message: 'Password must be at least 6 characters long'
    })
  }

  return await withErrorHandler(async () => {
    await connectToMongoDB()

    const existingUser = await User.findOne({
      $or: [
        { email: body.email.toLowerCase() },
        { username: body.username }
      ]
    })

    if (existingUser) {
      throw createError({
        statusCode: 409,
        message: existingUser.email === body.email.toLowerCase()
          ? 'User with this email already exists'
          : 'User with this username already exists'
      })
    }

    const firebaseAuth = getFirebaseAuth()

    const firebaseUser = await firebaseAuth.createUser({
      email: body.email.toLowerCase(),
      password: body.password,
      displayName: `${body.firstName} ${body.lastName}`,
      emailVerified: false,
    })

    const username = body.username.startsWith('@') ? body.username : `@${body.username}`

    const user = new User({
      firebaseId: firebaseUser.uid,
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      username: username.trim(),
      email: body.email.toLowerCase().trim(),
      department: body.department,
      status: body.status || 'Active',
      joined: new Date(),
    })

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
    defaultMessage: 'Failed to create user'
  })
})

