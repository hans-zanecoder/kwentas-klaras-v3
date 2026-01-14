import { UserService } from '../../services/user/UserService'
import type { CreateUserRequest } from '../../types/user/createUserRequest'
import { requireAdmin } from '../../utils/auth'
import { requireCSRF } from '../../utils/csrfMiddleware'
import { sanitizeString, sanitizeEmail } from '../../utils/sanitize'
import { withErrorHandler } from '../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  await requireCSRF(event)
  
  const body = await readBody<CreateUserRequest>(event)

  const sanitizedBody = {
    firstName: sanitizeString(body.firstName),
    lastName: sanitizeString(body.lastName),
    username: sanitizeString(body.username),
    email: sanitizeEmail(body.email),
    department: sanitizeString(body.department),
    status: body.status ? sanitizeString(body.status) : undefined,
    role: body.role ? sanitizeString(body.role) : undefined,
  }

  if (!sanitizedBody.firstName || !sanitizedBody.lastName || !sanitizedBody.username || !sanitizedBody.email || !sanitizedBody.department) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields: firstName, lastName, username, email, department'
    })
  }

  if (!sanitizedBody.email) {
    throw createError({
      statusCode: 400,
      message: 'Invalid email format'
    })
  }

  return await withErrorHandler(async () => {
    const userService = new UserService()
    const user = await userService.create({
      firstName: sanitizedBody.firstName,
      lastName: sanitizedBody.lastName,
      username: sanitizedBody.username,
      email: sanitizedBody.email,
      department: sanitizedBody.department,
      status: sanitizedBody.status,
      role: sanitizedBody.role,
    })

    return {
      success: true,
      user,
    }
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to create user'
  })
})

