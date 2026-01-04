import { AdditionalBudgetRepository } from '../../repositories/additionalBudget/AdditionalBudgetRepository';
import { ObligationRepository } from '../../repositories/obligation/ObligationRepository';
import { DisbursementRepository } from '../../repositories/disbursement/DisbursementRepository';
import type { PrismaClient } from '@prisma/client';

export class ComputationService {
  private budgetRepo: AdditionalBudgetRepository;
  private obligationRepo: ObligationRepository;
  private disbursementRepo: DisbursementRepository;

  constructor(prismaClient?: PrismaClient) {
    this.budgetRepo = new AdditionalBudgetRepository(prismaClient);
    this.obligationRepo = new ObligationRepository(prismaClient);
    this.disbursementRepo = new DisbursementRepository(prismaClient);
  }

  /**
   * Calculate the total added budget for a single project
   * @param projectId - The project ID
   * @returns The total added budget amount
   */
  async calculateTotalAddedBudget(projectId: string): Promise<number> {
    const budgets = await this.budgetRepo.findByProjectId(projectId);
    return budgets.reduce((sum, budget) => sum + budget.amount, 0);
  }

  /**
   * Calculate the total added budget for multiple projects
   * Returns a Map with projectId as key and totalAddedBudget as value
   * @param projectIds - Array of project IDs (optional, if not provided, calculates for all projects)
   * @returns Map of projectId to totalAddedBudget
   */
  async calculateTotalAddedBudgetsMap(projectIds?: string[]): Promise<Map<string, number>> {
    const budgetsMap = new Map<string, number>();
    
    let allBudgets: Awaited<ReturnType<typeof this.budgetRepo.findAll>>;
    if (projectIds && projectIds.length > 0) {
      // If specific project IDs are provided, fetch budgets for those projects only
      const budgetsPromises = projectIds.map(id => this.budgetRepo.findByProjectId(id));
      const budgetsArrays = await Promise.all(budgetsPromises);
      allBudgets = budgetsArrays.flat();
    } else {
      // Otherwise, fetch all budgets
      allBudgets = await this.budgetRepo.findAll();
    }
    
    allBudgets.forEach(budget => {
      const currentTotal = budgetsMap.get(budget.projectId) ?? 0;
      budgetsMap.set(budget.projectId, currentTotal + budget.amount);
    });
    
    return budgetsMap;
  }

  /**
   * Calculate the total obligations for a single project
   * @param projectId - The project ID
   * @returns The total obligations amount
   */
  async calculateTotalObligations(projectId: string): Promise<number> {
    const obligations = await this.obligationRepo.findByProjectId(projectId);
    return obligations.reduce((sum, obligation) => sum + obligation.amount, 0);
  }

  /**
   * Calculate the total obligations for multiple projects
   * Returns a Map with projectId as key and totalObligations as value
   * @param projectIds - Array of project IDs (optional, if not provided, calculates for all projects)
   * @returns Map of projectId to totalObligations
   */
  async calculateTotalObligationsMap(projectIds?: string[]): Promise<Map<string, number>> {
    const obligationsMap = new Map<string, number>();
    
    let allObligations: Awaited<ReturnType<typeof this.obligationRepo.findAll>>;
    if (projectIds && projectIds.length > 0) {
      // If specific project IDs are provided, fetch obligations for those projects only
      const obligationsPromises = projectIds.map(id => this.obligationRepo.findByProjectId(id));
      const obligationsArrays = await Promise.all(obligationsPromises);
      allObligations = obligationsArrays.flat();
    } else {
      // Otherwise, fetch all obligations
      allObligations = await this.obligationRepo.findAll();
    }
    
    allObligations.forEach(obligation => {
      const currentTotal = obligationsMap.get(obligation.projectId) ?? 0;
      obligationsMap.set(obligation.projectId, currentTotal + obligation.amount);
    });
    
    return obligationsMap;
  }

  /**
   * Calculate the total disbursements for a single project
   * @param projectId - The project ID
   * @returns The total disbursements amount
   */
  async calculateTotalDisbursements(projectId: string): Promise<number> {
    const disbursements = await this.disbursementRepo.findByProjectId(projectId);
    return disbursements.reduce((sum, disbursement) => sum + disbursement.amount, 0);
  }

  /**
   * Calculate the total disbursements for multiple projects
   * Returns a Map with projectId as key and totalDisbursements as value
   * @param projectIds - Array of project IDs (optional, if not provided, calculates for all projects)
   * @returns Map of projectId to totalDisbursements
   */
  async calculateTotalDisbursementsMap(projectIds?: string[]): Promise<Map<string, number>> {
    const disbursementsMap = new Map<string, number>();
    
    let allDisbursements: Awaited<ReturnType<typeof this.disbursementRepo.findAll>>;
    if (projectIds && projectIds.length > 0) {
      // If specific project IDs are provided, fetch disbursements for those projects only
      const disbursementsPromises = projectIds.map(id => this.disbursementRepo.findByProjectId(id));
      const disbursementsArrays = await Promise.all(disbursementsPromises);
      allDisbursements = disbursementsArrays.flat();
    } else {
      // Otherwise, fetch all disbursements
      allDisbursements = await this.disbursementRepo.findAll();
    }
    
    allDisbursements.forEach(disbursement => {
      const currentTotal = disbursementsMap.get(disbursement.projectId) ?? 0;
      disbursementsMap.set(disbursement.projectId, currentTotal + disbursement.amount);
    });
    
    return disbursementsMap;
  }
}

