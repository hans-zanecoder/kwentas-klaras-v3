import { connectToMongoDB } from '../../lib/mongodb'
import User from '../../models/User'
import { withErrorHandler } from '../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  return await withErrorHandler(async () => {
    await connectToMongoDB()

    const users = await User.find({})
      .sort({ createdAt: -1 })
      .lean()

    const formattedUsers = users.map((user: any) => ({
      id: user._id.toString(),
      firebaseId: user.firebaseId,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      department: user.department,
      status: user.status,
      joined: user.joined ? new Date(user.joined).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : undefined,
    }))

    return {
      success: true,
      users: formattedUsers,
    }
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to fetch users'
  })
})

