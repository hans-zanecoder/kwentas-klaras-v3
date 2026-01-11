import { ObligationRepository } from '../../repositories/obligation/ObligationRepository';
import { ObligationSerializer } from '../../serializers/ObligationSerializer';
import { ProjectRepository } from '../../repositories/project/ProjectRepository';
import { ComputationService } from '../computation/ComputationService';
import { ProjectActivityService } from '../project/ProjectActivityService';
import type { PrismaClient } from '@prisma/client';
import { prisma } from '../../lib/prisma';

export class ObligationService {
  private repo: ObligationRepository;
  private projectRepo: ProjectRepository;
  private computationService: ComputationService;
  private activityService: ProjectActivityService;
  private client: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.client = prismaClient || prisma;
    this.repo = new ObligationRepository(prismaClient);
    this.projectRepo = new ProjectRepository(prismaClient);
    this.computationService = new ComputationService(prismaClient);
    this.activityService = new ProjectActivityService();
  }

  async list() {
    const obligations = await this.repo.findAll();
    return ObligationSerializer.list(obligations);
  }

  async get(id: string) {
    const obligation = await this.repo.findById(id);
    return ObligationSerializer.detail(obligation);
  }

  async findByProject(projectId: string) {
    const obligations = await this.repo.findByProjectId(projectId);
    return ObligationSerializer.list(obligations);
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

    // Check if adding this obligation would exceed the remaining balance
    const project = await this.projectRepo.findById(data.projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const remainingBalance = await this.computationService.calculateRemainingBalance(
      data.projectId,
      project.appropriation
    );

    const currentTotalObligations = await this.computationService.calculateTotalObligations(data.projectId);
    const newTotalObligations = currentTotalObligations + data.amount;

    if (newTotalObligations > remainingBalance) {
      throw new Error(
        `Cannot add obligation. Total obligations (₱${newTotalObligations.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}) would exceed remaining balance (₱${remainingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}).`
      );
    }

    const obligation = await this.repo.create({
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
      action: 'obligation_added',
      description: `Obligation of <strong>${formattedAmount}</strong> was added. Payee: <strong>${data.payee.trim()}</strong>. Reason: ${data.reason.trim()}`,
    });

    return ObligationSerializer.detail(obligation);
  }
}

