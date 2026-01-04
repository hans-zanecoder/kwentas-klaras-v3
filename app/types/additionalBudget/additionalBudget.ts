export interface IAdditionalBudget {
  id?: string
  projectId: string
  amount: number
  reason: string
  approvedBy?: string
  approvedDate?: Date | string
  status?: 'pending' | 'approved' | 'rejected'
  createdAt?: Date | string
  updatedAt?: Date | string
}

