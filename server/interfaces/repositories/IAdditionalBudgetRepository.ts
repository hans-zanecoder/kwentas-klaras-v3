import type { Prisma, AdditionalBudget } from '@prisma/client';

export interface IAdditionalBudgetRepository {
  create(data: Prisma.AdditionalBudgetCreateInput): Promise<AdditionalBudget>;
  findAll(): Promise<AdditionalBudget[]>;
  findById(id: string): Promise<AdditionalBudget | null>;
  findByProjectId(projectId: string): Promise<AdditionalBudget[]>;
  updateById(id: string, update: Prisma.AdditionalBudgetUpdateInput): Promise<AdditionalBudget>;
  deleteById(id: string): Promise<AdditionalBudget>;
}

