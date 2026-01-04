import { prisma } from '../../lib/prisma';
import type { Prisma, PrismaClient, AdditionalBudget } from '@prisma/client';
import { IAdditionalBudgetRepository } from '../../interfaces/repositories/IAdditionalBudgetRepository';

export class AdditionalBudgetRepository implements IAdditionalBudgetRepository {
  private client: PrismaClient;

  constructor(client?: PrismaClient) {
    this.client = client || prisma;
  }

  async create(data: Prisma.AdditionalBudgetCreateInput): Promise<AdditionalBudget> {
    return this.client.additionalBudget.create({ data });
  }

  async findAll(): Promise<AdditionalBudget[]> {
    const budgets = await this.client.additionalBudget.findMany();
    return budgets.sort((a, b) => {
      if (!a.createdAt && !b.createdAt) return 0;
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }

  async findById(id: string): Promise<AdditionalBudget | null> {
    return this.client.additionalBudget.findUnique({ where: { id } });
  }

  async findByProjectId(projectId: string): Promise<AdditionalBudget[]> {
    const budgets = await this.client.additionalBudget.findMany({
      where: { projectId },
    });
    return budgets.sort((a, b) => {
      if (!a.createdAt && !b.createdAt) return 0;
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }

  async updateById(id: string, update: Prisma.AdditionalBudgetUpdateInput): Promise<AdditionalBudget> {
    return this.client.additionalBudget.update({ where: { id }, data: update });
  }

  async deleteById(id: string): Promise<AdditionalBudget> {
    return this.client.additionalBudget.delete({ where: { id } });
  }
}

