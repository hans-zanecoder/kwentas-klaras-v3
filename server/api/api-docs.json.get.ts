import { IS_DEVELOPMENT } from '../constants/environment'
import { swaggerSpec } from '../config/swagger'

export default defineEventHandler(async (event) => {
  if (!IS_DEVELOPMENT) {
    throw createError({
      statusCode: 404,
      message: 'Not found'
    })
  }

  setHeader(event, 'Content-Type', 'application/json')
  return swaggerSpec
})
