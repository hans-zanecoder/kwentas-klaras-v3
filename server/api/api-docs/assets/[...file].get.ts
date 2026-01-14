import { readFileSync } from 'fs'
import { extname, join } from 'path'

import { IS_DEVELOPMENT } from '../../../constants/environment'

const MIME_TYPES: Record<string, string> = {
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.html': 'text/html',
  '.json': 'application/json',
}

export default defineEventHandler(async (event) => {
  if (!IS_DEVELOPMENT) {
    throw createError({
      statusCode: 404,
      message: 'Not found'
    })
  }

  try {
    const params = getRouterParams(event)
    const fileSegments = params.file as string | string[] | undefined
    
    if (!fileSegments) {
      throw createError({
        statusCode: 404,
        message: 'File not found'
      })
    }

    const filePath = Array.isArray(fileSegments) ? fileSegments.join('/') : String(fileSegments)
    const swaggerUiDistPath = join(process.cwd(), 'node_modules', 'swagger-ui-dist')
    const requestedFile = join(swaggerUiDistPath, filePath)

    if (!requestedFile.startsWith(swaggerUiDistPath)) {
      throw createError({
        statusCode: 403,
        message: 'Access denied'
      })
    }

    const content = readFileSync(requestedFile)
    const ext = extname(filePath)
    const mimeType = MIME_TYPES[ext] || 'application/octet-stream'

    setHeader(event, 'Content-Type', mimeType)
    return content
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    throw createError({
      statusCode: 404,
      message: 'File not found'
    })
  }
})
