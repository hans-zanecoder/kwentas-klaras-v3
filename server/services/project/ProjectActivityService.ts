import { ProjectActivityRepository } from '../../repositories/project/ProjectActivityRepository'
import { ProjectActivitySerializer } from '../../serializers/ProjectActivitySerializer'

export class ProjectActivityService {
  private repo: ProjectActivityRepository

  constructor() {
    this.repo = new ProjectActivityRepository()
  }

  async create(data: {
    projectId: string
    action: string
    description: string
    userId?: string
    metadata?: string
  }) {
    const activity = await this.repo.create(data)
    return ProjectActivitySerializer.format(activity)
  }

  async findByProjectId(projectId: string) {
    const activities = await this.repo.findByProjectId(projectId)
    return ProjectActivitySerializer.list(activities)
  }
}

