import type { Project } from '@prisma/client';

export class ProjectSerializer {
  static formatProject(project: Project) {
    return {
      id: project.id,
      name: project.name,
      implementingUnit: project.implementingUnit,
      appropriation: project.appropriation,
      startDate: project.startDate,
      endDate: project.endDate,
      year: project.year,
      services: project.services,
    };
  }

  static list(projects: Project[]) {
    return projects.map(project => this.formatProject(project));
  }

  static detail(project: Project | null) {
    return project ? this.formatProject(project) : null;
  }
}
