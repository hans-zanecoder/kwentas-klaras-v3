import { DisbursementRepository } from '../../repositories/disbursement/DisbursementRepository';
import { DisbursementSerializer } from '../../serializers/DisbursementSerializer';
import { ProjectRepository } from '../../repositories/project/ProjectRepository';
import type { PrismaClient } from '@prisma/client';
import { prisma } from '../../lib/prisma';

export class DisbursementService {
  private repo: DisbursementRepository;
  private projectRepo: ProjectRepository;
  private client: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.client = prismaClient || prisma;
    this.repo = new DisbursementRepository(prismaClient);
    this.projectRepo = new ProjectRepository(prismaClient);
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

    const disbursement = await this.repo.create({
      projectId: data.projectId,
      amount: data.amount,
      reason: data.reason.trim(),
      payee: data.payee.trim(),
      approvedBy: data.approvedBy,
      approvedDate: data.approvedDate ? new Date(data.approvedDate) : null,
      status: data.status || 'pending',
    });

    return DisbursementSerializer.detail(disbursement);
  }
}

