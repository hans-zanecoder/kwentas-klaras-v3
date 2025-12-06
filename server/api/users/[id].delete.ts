import { connectToMongoDB } from '../../lib/mongodb'
import { getFirebaseAuth } from '../../lib/firebase'
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

    const user = await User.findById(id)

    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      })
    }

    const firebaseId = user.firebaseId

    await withErrorHandler(async () => {
      const firebaseAuth = getFirebaseAuth()
      await firebaseAuth.deleteUser(firebaseId)
    }, {
      defaultStatusCode: 500,
      defaultMessage: 'Failed to delete user from Firebase',
      logError: true
    }).catch((firebaseError: any) => {
      if (firebaseError.statusCode === 404 || firebaseError.code === 'auth/user-not-found') {
        return
      }
      throw firebaseError
    })

    await User.findByIdAndDelete(id)

    return {
      success: true,
      message: 'User deleted successfully'
    }
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to delete user'
  })
})

