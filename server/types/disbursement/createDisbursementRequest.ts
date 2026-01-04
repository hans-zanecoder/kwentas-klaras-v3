export interface CreateDisbursementRequest {
  projectId: string;
  amount: number;
  reason: string;
  payee: string;
  approvedBy?: string;
  approvedDate?: Date;
  status?: 'pending' | 'approved' | 'denied';
}

