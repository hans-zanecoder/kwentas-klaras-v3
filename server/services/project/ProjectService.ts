import { ProjectRepository } from '../../repositories/project/ProjectRepository';
import { ProjectSerializer } from '../../serializers/ProjectSerializer';
import { ProjectActivityService } from './ProjectActivityService';
import { PROJECT_FIELD_NAMES } from '../../constants/project/fieldNames';
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
    // totalAddedBudget is now stored in the database, so we can use it directly
    return ProjectSerializer.list(projects);
  }

  async get(id: string) {
    const project = await this.repo.findById(id);
    // totalAddedBudget is now stored in the database, so we can use it directly
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
            const projectData: Prisma.ProjectCreateInput = {
              name: data.name.trim(),
              appropriation: data.appropriation,
              year: data.year,
              services: data.services,
              startDate: new Date(data.startDate),
              endDate: new Date(data.endDate),
              ...(data.implementingUnit && { implementingUnit: data.implementingUnit }),
              ...(data.location && { location: data.location }),
              ...(data.remarks && { remarks: data.remarks }),
              ...(data.code && { code: data.code }),
            } as Prisma.ProjectCreateInput;

            const project = await this.repo.create(projectData);

    // New projects have 0 total added budget (set by default in schema)
    const serializedProject = ProjectSerializer.detail(project);
    
    if (project && project.id) {
      await this.activityService.create({
        projectId: project.id,
        action: 'created',
        description: `Project <strong>"${data.name}"</strong> was created`,
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
            const oldProject = await this.repo.findById(id);
            if (!oldProject) {
              throw new Error('Project not found');
            }

            const updateData: Prisma.ProjectUpdateInput = {};

            if (data.name !== undefined) {
              updateData.name = data.name.trim();
            }

            if (data.implementingUnit !== undefined) {
              updateData.implementingUnit = data.implementingUnit;
            }

            if (data.location !== undefined) {
              (updateData as any).location = data.location || null;
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
              (updateData as any).remarks = data.remarks || null;
            }

            if (data.code !== undefined) {
              (updateData as any).code = data.code || null;
            }

            if (data.startDate !== undefined) {
              updateData.startDate = new Date(data.startDate);
            }

            if (data.endDate !== undefined) {
              updateData.endDate = new Date(data.endDate);
            }

    const project = await this.repo.updateById(id, updateData);
    // totalAddedBudget is now stored in the database
    const serializedProject = ProjectSerializer.detail(project);
    
    if (project && project.id) {
      const formatValue = (value: any, fieldName: string): string => {
        if (value === null || value === undefined) return 'N/A';
        if (fieldName === 'startDate' || fieldName === 'endDate') {
          return new Date(value).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
        }
        if (fieldName === 'appropriation') {
          return `₱${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
        return String(value);
      };

      const changes: string[] = [];
      
      if (data.name !== undefined && oldProject.name !== data.name.trim()) {
        changes.push(`${PROJECT_FIELD_NAMES.name}: "${formatValue(oldProject.name, 'name')}" → "${formatValue(data.name.trim(), 'name')}"`);
      }
      if (data.implementingUnit !== undefined && oldProject.implementingUnit !== data.implementingUnit) {
        changes.push(`${PROJECT_FIELD_NAMES.implementingUnit}: "${formatValue(oldProject.implementingUnit, 'implementingUnit')}" → "${formatValue(data.implementingUnit, 'implementingUnit')}"`);
      }
      if (data.location !== undefined && oldProject.location !== data.location) {
        changes.push(`${PROJECT_FIELD_NAMES.location}: "${formatValue(oldProject.location, 'location')}" → "${formatValue(data.location, 'location')}"`);
      }
      if (data.appropriation !== undefined && oldProject.appropriation !== data.appropriation) {
        changes.push(`${PROJECT_FIELD_NAMES.appropriation}: ${formatValue(oldProject.appropriation, 'appropriation')} → ${formatValue(data.appropriation, 'appropriation')}`);
      }
      if (data.year !== undefined && oldProject.year !== data.year) {
        changes.push(`${PROJECT_FIELD_NAMES.year}: ${formatValue(oldProject.year, 'year')} → ${formatValue(data.year, 'year')}`);
      }
      if (data.services !== undefined && oldProject.services !== data.services) {
        changes.push(`${PROJECT_FIELD_NAMES.services}: "${formatValue(oldProject.services, 'services')}" → "${formatValue(data.services, 'services')}"`);
      }
      if (data.remarks !== undefined && oldProject.remarks !== data.remarks) {
        changes.push(`${PROJECT_FIELD_NAMES.remarks}: "${formatValue(oldProject.remarks, 'remarks')}" → "${formatValue(data.remarks, 'remarks')}"`);
      }
      if (data.code !== undefined && oldProject.code !== data.code) {
        changes.push(`${PROJECT_FIELD_NAMES.code}: "${formatValue(oldProject.code, 'code')}" → "${formatValue(data.code, 'code')}"`);
      }
      if (data.startDate !== undefined) {
        const oldDate = oldProject.startDate ? new Date(oldProject.startDate) : null;
        const newDate = new Date(data.startDate);
        if (!oldDate || oldDate.getTime() !== newDate.getTime()) {
          changes.push(`${PROJECT_FIELD_NAMES.startDate}: ${formatValue(oldProject.startDate, 'startDate')} → ${formatValue(data.startDate, 'startDate')}`);
        }
      }
      if (data.endDate !== undefined) {
        const oldDate = oldProject.endDate ? new Date(oldProject.endDate) : null;
        const newDate = new Date(data.endDate);
        if (!oldDate || oldDate.getTime() !== newDate.getTime()) {
          changes.push(`${PROJECT_FIELD_NAMES.endDate}: ${formatValue(oldProject.endDate, 'endDate')} → ${formatValue(data.endDate, 'endDate')}`);
        }
      }
      
      if (changes.length > 0) {
        const formattedChanges = changes.map(change => {
          const parts = change.split(' → ')
          if (parts.length === 2) {
            const fieldPart = parts[0]
            const newValue = parts[1]
            return `${fieldPart} → <strong>${newValue}</strong>`
          }
          return change
        })
      await this.activityService.create({
        projectId: project.id,
        action: 'updated',
          description: `Project <strong>"${project.name}"</strong> was updated. ${formattedChanges.join('; ')}`,
      });
      }
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
