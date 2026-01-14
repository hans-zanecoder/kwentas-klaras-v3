import { IS_DEVELOPMENT } from '../constants/environment'
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
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    if (logError) {
      console.error('Error in handler:', error)
    }

    const errorObj = error as { code?: string | number; name?: string; message?: string }

    if (errorObj.code === 'auth/email-already-exists') {
      throw createError({
        statusCode: 409,
        message: IS_DEVELOPMENT ? 'User with this email already exists in Firebase' : 'User with this email already exists'
      })
    }

    if (errorObj.code === 'auth/invalid-email') {
      throw createError({
        statusCode: 400,
        message: 'Invalid email address'
      })
    }

    if (errorObj.code === 'auth/weak-password') {
      throw createError({
        statusCode: 400,
        message: 'Password is too weak'
      })
    }

    if (errorObj.code === 11000) {
      throw createError({
        statusCode: 409,
        message: 'Duplicate entry detected'
      })
    }

    if (errorObj.name === 'CastError') {
      throw createError({
        statusCode: 400,
        message: 'Invalid ID format'
      })
    }

    const errorMessage = IS_DEVELOPMENT ? (errorObj.message || defaultMessage) : defaultMessage

    throw createError({
      statusCode: defaultStatusCode,
      message: errorMessage,
      data: IS_DEVELOPMENT ? errorObj.message : undefined
    })
  }
}

