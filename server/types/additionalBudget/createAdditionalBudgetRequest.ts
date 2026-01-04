export interface CreateAdditionalBudgetRequest {
  projectId: string;
  amount: number;
  reason: string;
  approvedBy?: string;
  approvedDate?: Date;
  status?: 'pending' | 'approved' | 'rejected';
}

