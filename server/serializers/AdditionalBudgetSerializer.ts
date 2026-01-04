import type { AdditionalBudget } from '@prisma/client';

export class AdditionalBudgetSerializer {
  static formatAdditionalBudget(budget: AdditionalBudget) {
    return {
      id: budget.id,
      projectId: budget.projectId,
      amount: budget.amount,
      reason: budget.reason,
      approvedBy: budget.approvedBy,
      approvedDate: budget.approvedDate,
      status: budget.status,
      createdAt: budget.createdAt,
      updatedAt: budget.updatedAt,
    };
  }

  static list(budgets: AdditionalBudget[]) {
    return budgets.map(budget => this.formatAdditionalBudget(budget));
  }

  static detail(budget: AdditionalBudget | null) {
    return budget ? this.formatAdditionalBudget(budget) : null;
  }
}

