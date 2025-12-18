import { prisma } from '../../lib/prisma'
import type { PrismaClient, ProjectActivity } from '@prisma/client'
import { IProjectActivityRepository } from '../../interfaces/repositories/IProjectActivityRepository'

export class ProjectActivityRepository implements IProjectActivityRepository {
  private client: PrismaClient

  constructor(client?: PrismaClient) {
    this.client = client || prisma
  }

  async create(data: {
    projectId: string
    action: string
    description: string
    userId?: string
    metadata?: string
  }): Promise<ProjectActivity> {
    return this.client.projectActivity.create({
      data: {
        projectId: data.projectId,
        action: data.action,
        description: data.description,
        userId: data.userId,
        metadata: data.metadata,
      },
    })
  }

  async findByProjectId(projectId: string): Promise<ProjectActivity[]> {
    return this.client.projectActivity.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    })
  }
}

