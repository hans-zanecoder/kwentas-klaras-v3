import type { UserDepartment } from '../../../app/types/user/userDepartment'
import type { UserService } from '../../../app/types/user/userServices'

export interface IProject {
  name: string
  implementingUnit: UserDepartment
  appropriation: number
  startDate: Date
  endDate: Date
  year: number
  services: UserService
  createdAt?: Date
  updatedAt?: Date
}

