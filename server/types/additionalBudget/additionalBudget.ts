export interface IAdditionalBudget {
  id?: string;
  projectId: string;
  amount: number;
  reason: string;
  approvedBy?: string;
  approvedDate?: Date;
  status?: 'pending' | 'approved' | 'rejected';
  createdAt?: Date;
  updatedAt?: Date;
}

