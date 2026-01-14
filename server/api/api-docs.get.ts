import { readFileSync } from 'fs'
import { join } from 'path'

import { IS_DEVELOPMENT } from '../constants/environment'
import { swaggerSpec } from '../config/swagger'

export default defineEventHandler(async (event) => {
  if (!IS_DEVELOPMENT) {
    throw createError({
      statusCode: 404,
      message: 'Not found'
    })
  }

  try {
    const swaggerUiDistPath = join(process.cwd(), 'node_modules', 'swagger-ui-dist')
    const swaggerUiIndexPath = join(swaggerUiDistPath, 'index.html')
    
    let html = readFileSync(swaggerUiIndexPath, 'utf-8')
    
    const apiDocsUrl = '/api/api-docs.json'
    const assetsBaseUrl = '/api/api-docs/assets'
    
    html = html.replace(
      'https://petstore.swagger.io/v2/swagger.json',
      apiDocsUrl
    )
    
    html = html.replace(
      '<title>Swagger UI</title>',
      '<title>Kwentas Klaras API Documentation</title>'
    )

    html = html.replace(/href="\.\/([^"]+)"/g, `href="${assetsBaseUrl}/$1"`)
    html = html.replace(/href="([^\/"][^"]*\.(css|png))"/g, `href="${assetsBaseUrl}/$1"`)
    html = html.replace(/src="\.\/([^"]+)"/g, `src="${assetsBaseUrl}/$1"`)
    
    const initializerContent = readFileSync(join(swaggerUiDistPath, 'swagger-initializer.js'), 'utf-8')
    const customInitializer = initializerContent.replace(
      '"https://petstore.swagger.io/v2/swagger.json"',
      `"${apiDocsUrl}"`
    )
    
    html = html.replace(
      /<script src="[^"]*swagger-initializer\.js"[^>]*>\s*<\/script>/,
      `<script>${customInitializer}</script>`
    )

    setHeader(event, 'Content-Type', 'text/html')
    return html
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to load Swagger UI'
    })
  }
})
