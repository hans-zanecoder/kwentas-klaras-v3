import { AdditionalBudgetRepository } from '../../repositories/additionalBudget/AdditionalBudgetRepository';
import { AdditionalBudgetSerializer } from '../../serializers/AdditionalBudgetSerializer';
import { ProjectActivityService } from '../project/ProjectActivityService';
import type { Prisma, PrismaClient } from '@prisma/client';

export class AdditionalBudgetService {
  private repo: AdditionalBudgetRepository;
  private activityService: ProjectActivityService;

  constructor(prismaClient?: PrismaClient) {
    this.repo = new AdditionalBudgetRepository(prismaClient);
    this.activityService = new ProjectActivityService();
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

    const formattedAmount = `₱${data.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    await this.activityService.create({
      projectId: data.projectId,
      action: 'budget_added',
      description: `Additional budget of <strong>${formattedAmount}</strong> was added. Reason: ${data.reason.trim()}`,
    });

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
    return AdditionalBudgetSerializer.detail(budget);
  }

  async remove(id: string) {
    const budget = await this.repo.findById(id);
    if (!budget) {
      throw new Error('Additional budget not found');
    }

    await this.repo.deleteById(id);
    return { success: true, message: 'Additional budget deleted successfully' };
  }
}

