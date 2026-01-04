import type { Project } from '@prisma/client';

export class ProjectSerializer {
          static formatProject(project: Project) {
            return {
              id: project.id,
              name: project.name,
              implementingUnit: project.implementingUnit,
              location: project.location,
              appropriation: project.appropriation,
              totalAddedBudget: project.totalAddedBudget ?? 0,
              startDate: project.startDate,
              endDate: project.endDate,
              year: project.year,
              services: project.services,
              remarks: project.remarks,
              code: project.code,
              createdAt: project.createdAt,
              updatedAt: project.updatedAt,
            };
          }

  static list(projects: Project[]) {
    return projects.map(project => this.formatProject(project));
  }

  static detail(project: Project | null) {
    return project ? this.formatProject(project) : null;
  }
}
