import { AdditionalBudgetRepository } from '../../repositories/additionalBudget/AdditionalBudgetRepository';
import { AdditionalBudgetSerializer } from '../../serializers/AdditionalBudgetSerializer';
import { ProjectRepository } from '../../repositories/project/ProjectRepository';
import { prisma } from '../../lib/prisma';
import type { Prisma, PrismaClient } from '@prisma/client';

export class AdditionalBudgetService {
  private repo: AdditionalBudgetRepository;
  private projectRepo: ProjectRepository;
  private client: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.client = prismaClient || prisma;
    this.repo = new AdditionalBudgetRepository(prismaClient);
    this.projectRepo = new ProjectRepository(prismaClient);
  }

  private async updateProjectTotalBudget(projectId: string) {
    const budgets = await this.repo.findByProjectId(projectId);
    const totalAddedBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
    
    // Use type assertion until Prisma client is regenerated
    await this.projectRepo.updateById(projectId, {
      totalAddedBudget: totalAddedBudget,
    } as any);
  }

  async list() {
    const budgets = await this.repo.findAll();
    return AdditionalBudgetSerializer.list(budgets);
  }

  async get(id: string) {
    const budget = await this.repo.findById(id);
    return AdditionalBudgetSerializer.detail(budget);
  }

  async findByProject(projectId: string) {
    const budgets = await this.repo.findByProjectId(projectId);
    return AdditionalBudgetSerializer.list(budgets);
  }

  async create(data: {
    projectId: string;
    amount: number;
    reason: string;
    approvedBy?: string;
    approvedDate?: Date;
    status?: string;
  }) {
    if (data.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    const budget = await this.repo.create({
      projectId: data.projectId,
      amount: data.amount,
      reason: data.reason.trim(),
      approvedBy: data.approvedBy,
      approvedDate: data.approvedDate ? new Date(data.approvedDate) : null,
      status: data.status || 'pending',
    });

    // Update project's total added budget
    await this.updateProjectTotalBudget(data.projectId);

    return AdditionalBudgetSerializer.detail(budget);
  }

  async update(id: string, data: {
    amount?: number;
    reason?: string;
    approvedBy?: string;
    approvedDate?: Date;
    status?: string;
  }) {
    const updateData: any = {};

    if (data.amount !== undefined) {
      if (data.amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }
      updateData.amount = data.amount;
    }

    if (data.reason !== undefined) {
      updateData.reason = data.reason.trim();
    }

    if (data.approvedBy !== undefined) {
      updateData.approvedBy = data.approvedBy;
    }

    if (data.approvedDate !== undefined) {
      updateData.approvedDate = data.approvedDate ? new Date(data.approvedDate) : null;
    }

    if (data.status !== undefined) {
      updateData.status = data.status;
    }

    const budget = await this.repo.updateById(id, updateData);
    
    // Update project's total added budget if amount changed
    if (data.amount !== undefined && budget) {
      await this.updateProjectTotalBudget(budget.projectId);
    }
    
    return AdditionalBudgetSerializer.detail(budget);
  }

  async remove(id: string) {
    const budget = await this.repo.findById(id);
    if (!budget) {
      throw new Error('Additional budget not found');
    }

    const projectId = budget.projectId;
    await this.repo.deleteById(id);
    
    // Update project's total added budget
    await this.updateProjectTotalBudget(projectId);
    
    return { success: true, message: 'Additional budget deleted successfully' };
  }
}

