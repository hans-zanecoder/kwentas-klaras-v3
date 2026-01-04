import type { Prisma, Disbursement } from '@prisma/client';

export interface IDisbursementRepository {
  create(data: Prisma.DisbursementCreateInput): Promise<Disbursement>;
  findAll(): Promise<Disbursement[]>;
  findById(id: string): Promise<Disbursement | null>;
  findByProjectId(projectId: string): Promise<Disbursement[]>;
}

