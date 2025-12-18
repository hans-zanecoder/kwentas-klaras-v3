import { ProjectRepository } from '../../repositories/project/ProjectRepository';
import { ProjectSerializer } from '../../serializers/ProjectSerializer';
import { ProjectActivityService } from './ProjectActivityService';
import type { Prisma, PrismaClient } from '@prisma/client';

export class ProjectService {
  private repo: ProjectRepository;
  private activityService: ProjectActivityService;

  constructor(prismaClient?: PrismaClient) {
    this.repo = new ProjectRepository(prismaClient);
    this.activityService = new ProjectActivityService();
  }

  async list() {
    const projects = await this.repo.findAll();
    return ProjectSerializer.list(projects);
  }

  async get(id: string) {
    const project = await this.repo.findById(id);
    return ProjectSerializer.detail(project);
  }

          async create(data: {
            name: string;
            implementingUnit?: string;
            location?: string;
            appropriation: number;
            year: number;
            services: string;
            remarks?: string;
            code?: string;
            startDate: Date;
            endDate: Date;
          }) {
            const project = await this.repo.create({
              name: data.name.trim(),
              implementingUnit: data.implementingUnit,
              location: data.location,
              appropriation: data.appropriation,
              year: data.year,
              services: data.services,
              remarks: data.remarks,
              code: data.code,
              startDate: new Date(data.startDate),
              endDate: new Date(data.endDate),
            });

    const serializedProject = ProjectSerializer.detail(project);
    
    if (project && project.id) {
      await this.activityService.create({
        projectId: project.id,
        action: 'created',
        description: `Project "${data.name}" was created`,
      });
    }

    return serializedProject;
  }

          async update(id: string, data: {
            name?: string;
            implementingUnit?: string;
            location?: string;
            appropriation?: number;
            year?: number;
            services?: string;
            remarks?: string;
            code?: string;
            startDate?: Date;
            endDate?: Date;
          }) {
            const updateData: Prisma.ProjectUpdateInput = {};

            if (data.name !== undefined) {
              updateData.name = data.name.trim();
            }

            if (data.implementingUnit !== undefined) {
              updateData.implementingUnit = data.implementingUnit;
            }

            if (data.location !== undefined) {
              updateData.location = data.location;
            }

            if (data.appropriation !== undefined) {
              updateData.appropriation = data.appropriation;
            }

            if (data.year !== undefined) {
              updateData.year = data.year;
            }

            if (data.services !== undefined) {
              updateData.services = data.services;
            }

            if (data.remarks !== undefined) {
              updateData.remarks = data.remarks;
            }

            if (data.code !== undefined) {
              updateData.code = data.code;
            }

            if (data.startDate !== undefined) {
              updateData.startDate = new Date(data.startDate);
            }

            if (data.endDate !== undefined) {
              updateData.endDate = new Date(data.endDate);
            }

    const project = await this.repo.updateById(id, updateData);
    const serializedProject = ProjectSerializer.detail(project);
    
    if (project && project.id) {
      const changes: string[] = []
      if (data.name !== undefined) changes.push('name')
      if (data.implementingUnit !== undefined) changes.push('implementing unit')
      if (data.location !== undefined) changes.push('location')
      if (data.appropriation !== undefined) changes.push('appropriation')
      if (data.year !== undefined) changes.push('year')
      if (data.services !== undefined) changes.push('services')
      if (data.remarks !== undefined) changes.push('remarks')
      if (data.code !== undefined) changes.push('code')
      if (data.startDate !== undefined) changes.push('start date')
      if (data.endDate !== undefined) changes.push('end date')
      
      await this.activityService.create({
        projectId: project.id,
        action: 'updated',
        description: `Project "${project.name}" was updated. Changed: ${changes.join(', ')}`,
      });
    }

    return serializedProject;
  }

  async remove(id: string) {
    const project = await this.repo.findById(id);
    if (!project) {
      throw new Error('Project not found');
    }

    await this.repo.deleteById(id);
    return { success: true, message: 'Project deleted successfully' };
  }
}
