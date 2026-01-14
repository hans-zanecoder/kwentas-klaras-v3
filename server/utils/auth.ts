import type { User } from '@prisma/client'
import type { EventHandlerRequest, H3Event } from 'h3'
import { getFirebaseAuth } from '../lib/firebase'
import { UserRepository } from '../repositories/user/UserRepository'
import { UserRole } from '../../app/enums/UserRole'

export interface AuthenticatedUser extends User {
  firebaseId: string
  status: string
  role: string
}

export async function requireAuth(event: H3Event<EventHandlerRequest>): Promise<AuthenticatedUser> {
  const authHeader = getHeader(event, 'authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      message: 'Authorization token required'
    })
  }

  const idToken = authHeader.replace('Bearer ', '')
  const firebaseAuth = getFirebaseAuth()
  
  let decodedToken
  try {
    decodedToken = await firebaseAuth.verifyIdToken(idToken)
  } catch (error) {
    throw createError({
      statusCode: 401,
      message: 'Invalid or expired token'
    })
  }

  const userRepository = new UserRepository()
  const dbUser = await userRepository.findByFirebaseId(decodedToken.uid)

  if (!dbUser) {
    throw createError({
      statusCode: 401,
      message: 'User not found'
    })
  }

  if (dbUser.status !== 'Active') {
    throw createError({
      statusCode: 403,
      message: 'User account is inactive'
    })
  }

  if (!dbUser.firebaseId) {
    throw createError({
      statusCode: 401,
      message: 'User authentication incomplete'
    })
  }

  return {
    ...dbUser,
    firebaseId: dbUser.firebaseId,
    status: dbUser.status || 'Active',
    role: dbUser.role || 'staffs'
  }
}

export async function requireAdmin(event: H3Event<EventHandlerRequest>): Promise<AuthenticatedUser> {
  const user = await requireAuth(event)
  
  if (user.role !== UserRole.ADMIN) {
    throw createError({
      statusCode: 403,
      message: 'Admin access required'
    })
  }

  return user
}
