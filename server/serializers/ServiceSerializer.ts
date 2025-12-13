import type { Service } from '@prisma/client';

export class ServiceSerializer {
  static formatService(service: Service) {
    return {
      id: service.id,
      name: service.name,
    };
  }

  static list(services: Service[]) {
    return services.map(service => this.formatService(service));
  }

  static detail(service: Service | null) {
    return service ? this.formatService(service) : null;
  }
}
