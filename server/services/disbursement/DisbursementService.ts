import { DisbursementRepository } from '../../repositories/disbursement/DisbursementRepository';
import { DisbursementSerializer } from '../../serializers/DisbursementSerializer';
import { ProjectRepository } from '../../repositories/project/ProjectRepository';
import { ObligationRepository } from '../../repositories/obligation/ObligationRepository';
import { ComputationService } from '../computation/ComputationService';
import { ProjectActivityService } from '../project/ProjectActivityService';
import type { PrismaClient } from '@prisma/client';
import { prisma } from '../../lib/prisma';

export class DisbursementService {
  private repo: DisbursementRepository;
  private projectRepo: ProjectRepository;
  private obligationRepo: ObligationRepository;
  private computationService: ComputationService;
  private activityService: ProjectActivityService;
  private client: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.client = prismaClient || prisma;
    this.repo = new DisbursementRepository(prismaClient);
    this.projectRepo = new ProjectRepository(prismaClient);
    this.obligationRepo = new ObligationRepository(prismaClient);
    this.computationService = new ComputationService(prismaClient);
    this.activityService = new ProjectActivityService();
  }

  async list() {
    const disbursements = await this.repo.findAll();
    
    // Fetch project names for all unique project IDs
    const projectIds = [...new Set(disbursements.map(d => d.projectId))];
    const projects = await Promise.all(
      projectIds.map(id => this.projectRepo.findById(id))
    );
    const projectMap = new Map(
      projects.filter(p => p !== null).map(p => [p!.id, p!.name])
    );
    
    return DisbursementSerializer.list(disbursements, projectMap);
  }

  async get(id: string) {
    const disbursement = await this.repo.findById(id);
    if (!disbursement) {
      return null;
    }
    const project = await this.projectRepo.findById(disbursement.projectId);
    return DisbursementSerializer.detail(disbursement, project?.name);
  }

  async findByProject(projectId: string) {
    const disbursements = await this.repo.findByProjectId(projectId);
    const project = await this.projectRepo.findById(projectId);
    const projectMap = project ? new Map([[project.id, project.name]]) : new Map();
    return DisbursementSerializer.list(disbursements, projectMap);
  }

  async create(data: {
    projectId: string;
    amount: number;
    reason: string;
    payee: string;
    approvedBy?: string;
    approvedDate?: Date;
    status?: string;
  }) {
    if (data.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    if (!data.payee || data.payee.trim() === '') {
      throw new Error('Payee is required');
    }

    // Check remaining balance before creating disbursement
    const project = await this.projectRepo.findById(data.projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const remainingBalance = await this.computationService.calculateRemainingBalance(
      data.projectId,
      project.appropriation
    );

    if (data.amount > remainingBalance) {
      throw new Error(
        `Insufficient balance. Remaining balance: ₱${remainingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      );
    }

    // Check if disbursement amount exceeds remaining obligations
    const remainingObligations = await this.computationService.calculateRemainingObligations(data.projectId);
    
    if (data.amount > remainingObligations) {
      throw new Error(
        `Cannot add disbursement. Amount (₱${data.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}) exceeds remaining obligations (₱${remainingObligations.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}).`
      );
    }

    const disbursement = await this.repo.create({
      projectId: data.projectId,
      amount: data.amount,
      reason: data.reason.trim(),
      payee: data.payee.trim(),
      approvedBy: data.approvedBy,
      approvedDate: data.approvedDate ? new Date(data.approvedDate) : null,
      status: data.status || 'pending',
    });

    const formattedAmount = `₱${data.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    await this.activityService.create({
      projectId: data.projectId,
      action: 'disbursement_added',
      description: `Disbursement of <strong>${formattedAmount}</strong> was added. Payee: <strong>${data.payee.trim()}</strong>. Reason: ${data.reason.trim()}`,
    });

    return DisbursementSerializer.detail(disbursement);
  }

  async updateStatus(id: string, status: 'pending' | 'approved' | 'denied', approvedBy?: string, approvedDate?: Date) {
    const disbursement = await this.repo.findById(id);
    if (!disbursement) {
      throw new Error('Disbursement not found');
    }

    // If approving, deduct from obligations
    if (status === 'approved' && disbursement.status !== 'approved') {
      await this.deductFromObligations(disbursement.projectId, disbursement.amount);
    }

    // Update disbursement status
    const updatedDisbursement = await this.repo.update(id, {
      status,
      approvedBy: approvedBy || disbursement.approvedBy,
      approvedDate: approvedDate ? new Date(approvedDate) : (status === 'approved' ? new Date() : disbursement.approvedDate),
    });

    const project = await this.projectRepo.findById(updatedDisbursement.projectId);
    return DisbursementSerializer.detail(updatedDisbursement, project?.name);
  }

  private async deductFromObligations(projectId: string, amount: number) {
    // Get all obligations for this project
    const obligations = await this.obligationRepo.findByProjectId(projectId);
    
    // Get pending obligations sorted by creation date (oldest first)
    const pendingObligations = obligations
      .filter(ob => ob.status === 'pending' && ob.amount > 0)
      .sort((a, b) => {
        if (!a.createdAt && !b.createdAt) return 0;
        if (!a.createdAt) return 1;
        if (!b.createdAt) return -1;
        return a.createdAt.getTime() - b.createdAt.getTime();
      });

    let remainingAmount = amount;

    // Deduct from obligations, starting with the oldest pending obligation
    for (const obligation of pendingObligations) {
      if (remainingAmount <= 0) break;

      if (obligation.amount <= remainingAmount) {
        // This obligation is fully covered by the disbursement
        remainingAmount -= obligation.amount;
        await this.obligationRepo.update(obligation.id, {
          amount: 0,
          status: 'approved', // Mark as fully paid
        });
      } else {
        // Partially deduct from this obligation
        const newAmount = obligation.amount - remainingAmount;
        await this.obligationRepo.update(obligation.id, {
          amount: newAmount,
        });
        remainingAmount = 0;
      }
    }
  }
}

