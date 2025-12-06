import type { UserDepartment } from '../../../app/types/user/userDepartment'

export interface UpdateUserRequest {
  firstName?: string
  lastName?: string
  username?: string
  email?: string
  department?: UserDepartment
  status?: 'Active' | 'Inactive'
}

