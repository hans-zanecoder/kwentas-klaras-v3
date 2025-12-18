import type { ProjectActivity } from '@prisma/client'

export class ProjectActivitySerializer {
  static format(activity: ProjectActivity) {
    return {
      id: activity.id,
      projectId: activity.projectId,
      action: activity.action,
      description: activity.description,
      userId: activity.userId,
      metadata: activity.metadata,
      createdAt: activity.createdAt,
    }
  }

  static list(activities: ProjectActivity[]) {
    return activities.map((activity) => this.format(activity))
  }
}

