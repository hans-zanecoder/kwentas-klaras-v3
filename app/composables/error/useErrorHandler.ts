import type { ErrorHandlerOptions } from '~/types/error/errorHandler'

export const useErrorHandler = async <T>(
  asyncFn: () => Promise<T>,
  options: ErrorHandlerOptions = {}
): Promise<T> => {
  const {
    defaultMessage = 'An error occurred',
    logError = true,
    onError
  } = options

  try {
    return await asyncFn()
  } catch (error: any) {
    const errorMessage = error?.message || error?.data?.message || defaultMessage
    const errorObj = new Error(errorMessage)

    if (logError) {
      console.error('Error in async function:', error)
    }

    if (onError) {
      onError(errorObj)
    }

    throw errorObj
  }
}

