import { ServiceRepository } from '../../repositories/service/ServiceRepository';
import { ServiceSerializer } from '../../serializers/ServiceSerializer';
import type { PrismaClient } from '@prisma/client';

export class ServiceService {
  private repo: ServiceRepository;

  constructor(prismaClient?: PrismaClient) {
    this.repo = new ServiceRepository(prismaClient);
  }

  async list() {
    const services = await this.repo.findAll();
    return ServiceSerializer.list(services);
  }

  async get(id: string) {
    const service = await this.repo.findById(id);
    return ServiceSerializer.detail(service);
  }
}
