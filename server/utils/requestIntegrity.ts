import { createHmac, timingSafeEqual } from 'crypto'
import type { H3Event } from 'h3'

import {
  REQUEST_SIGNATURE_SECRET,
  REQUEST_TIMESTAMP_TOLERANCE_MS,
} from '../constants/requestIntegrity/requestIntegrity'

export function generateRequestSignature(
  method: string,
  path: string,
  body: string,
  timestamp: number
): string {
  const message = `${method}:${path}:${body}:${timestamp}`
  return createHmac('sha256', REQUEST_SIGNATURE_SECRET)
    .update(message)
    .digest('hex')
}

export function validateRequestSignature(
  method: string,
  path: string,
  body: string,
  timestamp: number,
  signature: string
): boolean {
  const now = Date.now()
  
  if (Math.abs(now - timestamp) > REQUEST_TIMESTAMP_TOLERANCE_MS) {
    return false
  }

  const expectedSignature = generateRequestSignature(method, path, body, timestamp)
  
  if (expectedSignature.length !== signature.length) {
    return false
  }

  return timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(signature)
  )
}

export async function requireRequestIntegrity(event: H3Event): Promise<void> {
  const method = getMethod(event)
  
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
    return
  }

  const signature = getHeader(event, 'x-request-signature')
  const timestamp = getHeader(event, 'x-request-timestamp')

  if (!signature || !timestamp) {
    throw createError({
      statusCode: 403,
      message: 'Request signature required'
    })
  }

  const timestampNum = parseInt(timestamp, 10)
  if (isNaN(timestampNum)) {
    throw createError({
      statusCode: 403,
      message: 'Invalid request timestamp'
    })
  }

  const path = getRequestURL(event).pathname
  const body = await readRawBody(event).catch(() => '')
  const bodyString = body ? body.toString() : ''

  if (!validateRequestSignature(method, path, bodyString, timestampNum, signature)) {
    throw createError({
      statusCode: 403,
      message: 'Invalid request signature'
    })
  }
}
