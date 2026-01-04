import { prisma } from '../../lib/prisma';
import type { Prisma, PrismaClient, Disbursement } from '@prisma/client';
import { IDisbursementRepository } from '../../interfaces/repositories/IDisbursementRepository';

export class DisbursementRepository implements IDisbursementRepository {
  private client: PrismaClient;

  constructor(client?: PrismaClient) {
    this.client = client || prisma;
  }

  async create(data: Prisma.DisbursementCreateInput): Promise<Disbursement> {
    return this.client.disbursement.create({ data });
  }

  async findAll(): Promise<Disbursement[]> {
    const disbursements = await this.client.disbursement.findMany();
    return disbursements.sort((a, b) => {
      if (!a.createdAt && !b.createdAt) return 0;
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }

  async findById(id: string): Promise<Disbursement | null> {
    return this.client.disbursement.findUnique({ where: { id } });
  }

  async findByProjectId(projectId: string): Promise<Disbursement[]> {
    const disbursements = await this.client.disbursement.findMany({
      where: { projectId },
    });
    return disbursements.sort((a, b) => {
      if (!a.createdAt && !b.createdAt) return 0;
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }
}

