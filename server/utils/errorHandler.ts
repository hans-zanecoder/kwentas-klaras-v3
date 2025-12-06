import type { ErrorHandlerOptions } from '../types/errorHandler'

export const withErrorHandler = async <T>(
  handler: () => Promise<T>,
  options: ErrorHandlerOptions = {}
): Promise<T> => {
  const {
    defaultStatusCode = 500,
    defaultMessage = 'An error occurred',
    logError = true
  } = options

  try {
    return await handler()
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    if (logError) {
      console.error('Error in handler:', error)
    }

    if (error.code === 'auth/email-already-exists') {
      throw createError({
        statusCode: 409,
        message: 'User with this email already exists in Firebase'
      })
    }

    if (error.code === 'auth/invalid-email') {
      throw createError({
        statusCode: 400,
        message: 'Invalid email address'
      })
    }

    if (error.code === 'auth/weak-password') {
      throw createError({
        statusCode: 400,
        message: 'Password is too weak'
      })
    }

    if (error.code === 11000) {
      throw createError({
        statusCode: 409,
        message: 'Duplicate entry detected'
      })
    }

    if (error.name === 'CastError') {
      throw createError({
        statusCode: 400,
        message: 'Invalid ID format'
      })
    }

    throw createError({
      statusCode: defaultStatusCode,
      message: error.message || defaultMessage,
      data: error.message
    })
  }
}

