import { ProjectRepository } from '../../repositories/project/ProjectRepository';
import { ProjectSerializer } from '../../serializers/ProjectSerializer';
import type { Prisma, PrismaClient } from '@prisma/client';

export class ProjectService {
  private repo: ProjectRepository;

  constructor(prismaClient?: PrismaClient) {
    this.repo = new ProjectRepository(prismaClient);
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
    appropriation: number;
    year: number;
    services: string;
    startDate: Date;
    endDate: Date;
  }) {
    const project = await this.repo.create({
      name: data.name.trim(),
      implementingUnit: data.implementingUnit,
      appropriation: data.appropriation,
      year: data.year,
      services: data.services,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    });

    return ProjectSerializer.detail(project);
  }

  async update(id: string, data: {
    name?: string;
    implementingUnit?: string;
    appropriation?: number;
    year?: number;
    services?: string;
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

    if (data.appropriation !== undefined) {
      updateData.appropriation = data.appropriation;
    }

    if (data.year !== undefined) {
      updateData.year = data.year;
    }

    if (data.services !== undefined) {
      updateData.services = data.services;
    }

    if (data.startDate !== undefined) {
      updateData.startDate = new Date(data.startDate);
    }

    if (data.endDate !== undefined) {
      updateData.endDate = new Date(data.endDate);
    }

    const project = await this.repo.updateById(id, updateData);
    return ProjectSerializer.detail(project);
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
