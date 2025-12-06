import type { UserDepartment } from '../../../app/types/user/userDepartment'

export interface IUser {
  firebaseId: string
  firstName: string
  lastName: string
  username: string
  email: string
  department: UserDepartment
  status: 'Active' | 'Inactive'
  joined?: Date
  createdAt?: Date
  updatedAt?: Date
}

