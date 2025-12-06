import type { UserDepartment } from '../../../app/types/user/userDepartment'

export interface CreateUserRequest {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  department: UserDepartment
  status?: 'Active' | 'Inactive'
}

