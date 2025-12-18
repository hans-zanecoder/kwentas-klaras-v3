import type { ProjectActivity } from '@prisma/client'

export interface IProjectActivityRepository {
  create(data: {
    projectId: string
    action: string
    description: string
    userId?: string
    metadata?: string
  }): Promise<ProjectActivity>
  findByProjectId(projectId: string): Promise<ProjectActivity[]>
}

