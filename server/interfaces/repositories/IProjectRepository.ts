import type { Prisma, Project } from '@prisma/client';

export interface IProjectRepository {
  create(data: Prisma.ProjectCreateInput): Promise<Project>;
  findAll(): Promise<Project[]>;
  findById(id: string): Promise<Project | null>;
  updateById(id: string, update: Prisma.ProjectUpdateInput): Promise<Project>;
  deleteById(id: string): Promise<Project>;
}
