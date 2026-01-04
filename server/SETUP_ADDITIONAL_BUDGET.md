# Setup Guide: AdditionalBudget Model

This guide shows how to set up an "AdditionalBudget" model following the existing backend architecture patterns.

## Architecture Overview

The backend follows a layered architecture:
1. **Prisma Schema** - Database model definition
2. **Repository Interface** - Contract for data access
3. **Repository Implementation** - Data access layer
4. **Service** - Business logic layer
5. **Serializer** - Data transformation layer
6. **API Endpoints** - HTTP handlers
7. **Types** - TypeScript type definitions

---

## Step 1: Add Prisma Model

Add the following model to `prisma/schema.prisma`:

```prisma
model AdditionalBudget {
  id            String    @id @default(auto()) @map("_id") @db.ObjectId
  projectId     String    @map("project_id") @db.ObjectId
  amount        Float
  reason        String
  approvedBy    String?   @map("approved_by")
  approvedDate  DateTime? @map("approved_date")
  status        String    @default("pending") // pending, approved, rejected
  createdAt     DateTime? @default(now()) @map("created_at")
  updatedAt     DateTime? @updatedAt @map("updated_at")

  @@index([projectId])
  @@index([status])
  @@index([createdAt])
  @@map("additional_budgets")
}
```

After adding, run:
```bash
npx prisma generate
npx prisma db push
```

---

## Step 2: Create Repository Interface

Create `server/interfaces/repositories/IAdditionalBudgetRepository.ts`:

```typescript
import type { Prisma, AdditionalBudget } from '@prisma/client';

export interface IAdditionalBudgetRepository {
  create(data: Prisma.AdditionalBudgetCreateInput): Promise<AdditionalBudget>;
  findAll(): Promise<AdditionalBudget[]>;
  findById(id: string): Promise<AdditionalBudget | null>;
  findByProjectId(projectId: string): Promise<AdditionalBudget[]>;
  updateById(id: string, update: Prisma.AdditionalBudgetUpdateInput): Promise<AdditionalBudget>;
  deleteById(id: string): Promise<AdditionalBudget>;
}
```

---

## Step 3: Create Repository Implementation

Create `server/repositories/additionalBudget/AdditionalBudgetRepository.ts`:

```typescript
import { prisma } from '../../lib/prisma';
import type { Prisma, PrismaClient, AdditionalBudget } from '@prisma/client';
import { IAdditionalBudgetRepository } from '../../interfaces/repositories/IAdditionalBudgetRepository';

export class AdditionalBudgetRepository implements IAdditionalBudgetRepository {
  private client: PrismaClient;

  constructor(client?: PrismaClient) {
    this.client = client || prisma;
  }

  async create(data: Prisma.AdditionalBudgetCreateInput): Promise<AdditionalBudget> {
    return this.client.additionalBudget.create({ data });
  }

  async findAll(): Promise<AdditionalBudget[]> {
    const budgets = await this.client.additionalBudget.findMany();
    return budgets.sort((a, b) => {
      if (!a.createdAt && !b.createdAt) return 0;
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }

  async findById(id: string): Promise<AdditionalBudget | null> {
    return this.client.additionalBudget.findUnique({ where: { id } });
  }

  async findByProjectId(projectId: string): Promise<AdditionalBudget[]> {
    const budgets = await this.client.additionalBudget.findMany({
      where: { projectId },
    });
    return budgets.sort((a, b) => {
      if (!a.createdAt && !b.createdAt) return 0;
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }

  async updateById(id: string, update: Prisma.AdditionalBudgetUpdateInput): Promise<AdditionalBudget> {
    return this.client.additionalBudget.update({ where: { id }, data: update });
  }

  async deleteById(id: string): Promise<AdditionalBudget> {
    return this.client.additionalBudget.delete({ where: { id } });
  }
}
```

---

## Step 4: Create Serializer

Create `server/serializers/AdditionalBudgetSerializer.ts`:

```typescript
import type { AdditionalBudget } from '@prisma/client';

export class AdditionalBudgetSerializer {
  static formatAdditionalBudget(budget: AdditionalBudget) {
    return {
      id: budget.id,
      projectId: budget.projectId,
      amount: budget.amount,
      reason: budget.reason,
      approvedBy: budget.approvedBy,
      approvedDate: budget.approvedDate,
      status: budget.status,
      createdAt: budget.createdAt,
      updatedAt: budget.updatedAt,
    };
  }

  static list(budgets: AdditionalBudget[]) {
    return budgets.map(budget => this.formatAdditionalBudget(budget));
  }

  static detail(budget: AdditionalBudget | null) {
    return budget ? this.formatAdditionalBudget(budget) : null;
  }
}
```

---

## Step 5: Create Service

Create `server/services/additionalBudget/AdditionalBudgetService.ts`:

```typescript
import { AdditionalBudgetRepository } from '../../repositories/additionalBudget/AdditionalBudgetRepository';
import { AdditionalBudgetSerializer } from '../../serializers/AdditionalBudgetSerializer';
import type { Prisma, PrismaClient } from '@prisma/client';

export class AdditionalBudgetService {
  private repo: AdditionalBudgetRepository;

  constructor(prismaClient?: PrismaClient) {
    this.repo = new AdditionalBudgetRepository(prismaClient);
  }

  async list() {
    const budgets = await this.repo.findAll();
    return AdditionalBudgetSerializer.list(budgets);
  }

  async get(id: string) {
    const budget = await this.repo.findById(id);
    return AdditionalBudgetSerializer.detail(budget);
  }

  async findByProject(projectId: string) {
    const budgets = await this.repo.findByProjectId(projectId);
    return AdditionalBudgetSerializer.list(budgets);
  }

  async create(data: {
    projectId: string;
    amount: number;
    reason: string;
    approvedBy?: string;
    approvedDate?: Date;
    status?: string;
  }) {
    if (data.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    const budget = await this.repo.create({
      projectId: data.projectId,
      amount: data.amount,
      reason: data.reason.trim(),
      approvedBy: data.approvedBy,
      approvedDate: data.approvedDate ? new Date(data.approvedDate) : null,
      status: data.status || 'pending',
    });

    return AdditionalBudgetSerializer.detail(budget);
  }

  async update(id: string, data: {
    amount?: number;
    reason?: string;
    approvedBy?: string;
    approvedDate?: Date;
    status?: string;
  }) {
    const updateData: Prisma.AdditionalBudgetUpdateInput = {};

    if (data.amount !== undefined) {
      if (data.amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }
      updateData.amount = data.amount;
    }

    if (data.reason !== undefined) {
      updateData.reason = data.reason.trim();
    }

    if (data.approvedBy !== undefined) {
      updateData.approvedBy = data.approvedBy;
    }

    if (data.approvedDate !== undefined) {
      updateData.approvedDate = data.approvedDate ? new Date(data.approvedDate) : null;
    }

    if (data.status !== undefined) {
      updateData.status = data.status;
    }

    const budget = await this.repo.updateById(id, updateData);
    return AdditionalBudgetSerializer.detail(budget);
  }

  async remove(id: string) {
    const budget = await this.repo.findById(id);
    if (!budget) {
      throw new Error('Additional budget not found');
    }

    await this.repo.deleteById(id);
    return { success: true, message: 'Additional budget deleted successfully' };
  }
}
```

---

## Step 6: Create Type Definitions

Create `server/types/additionalBudget/additionalBudget.ts`:

```typescript
export interface IAdditionalBudget {
  id?: string;
  projectId: string;
  amount: number;
  reason: string;
  approvedBy?: string;
  approvedDate?: Date;
  status?: 'pending' | 'approved' | 'rejected';
  createdAt?: Date;
  updatedAt?: Date;
}
```

Create `server/types/additionalBudget/createAdditionalBudgetRequest.ts`:

```typescript
export interface CreateAdditionalBudgetRequest {
  projectId: string;
  amount: number;
  reason: string;
  approvedBy?: string;
  approvedDate?: Date;
  status?: 'pending' | 'approved' | 'rejected';
}
```

Create `server/types/additionalBudget/updateAdditionalBudgetRequest.ts`:

```typescript
export interface UpdateAdditionalBudgetRequest {
  amount?: number;
  reason?: string;
  approvedBy?: string;
  approvedDate?: Date;
  status?: 'pending' | 'approved' | 'rejected';
}
```

---

## Step 7: Create API Endpoints

### GET /api/additional-budgets
Create `server/api/additional-budgets/index.get.ts`:

```typescript
import { AdditionalBudgetService } from '../../services/additionalBudget/AdditionalBudgetService'
import { withErrorHandler } from '../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  return await withErrorHandler(async () => {
    const budgetService = new AdditionalBudgetService()
    const budgets = await budgetService.list()
    
    return {
      success: true,
      budgets,
    }
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to fetch additional budgets'
  })
})
```

### GET /api/additional-budgets/[id]
Create `server/api/additional-budgets/[id].get.ts`:

```typescript
import { AdditionalBudgetService } from '../../services/additionalBudget/AdditionalBudgetService'
import { withErrorHandler } from '../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Budget ID is required'
    })
  }

  return await withErrorHandler(async () => {
    const budgetService = new AdditionalBudgetService()
    const budget = await budgetService.get(id)
    
    if (!budget) {
      throw createError({
        statusCode: 404,
        message: 'Additional budget not found'
      })
    }
    
    return {
      success: true,
      budget,
    }
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to fetch additional budget'
  })
})
```

### GET /api/additional-budgets/project/[projectId]
Create `server/api/additional-budgets/project/[projectId].get.ts`:

```typescript
import { AdditionalBudgetService } from '../../services/additionalBudget/AdditionalBudgetService'
import { withErrorHandler } from '../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  const projectId = getRouterParam(event, 'projectId')
  
  if (!projectId) {
    throw createError({
      statusCode: 400,
      message: 'Project ID is required'
    })
  }

  return await withErrorHandler(async () => {
    const budgetService = new AdditionalBudgetService()
    const budgets = await budgetService.findByProject(projectId)
    
    return {
      success: true,
      budgets,
    }
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to fetch additional budgets for project'
  })
})
```

### POST /api/additional-budgets/create
Create `server/api/additional-budgets/create.post.ts`:

```typescript
import { AdditionalBudgetService } from '../../services/additionalBudget/AdditionalBudgetService'
import type { CreateAdditionalBudgetRequest } from '../../types/additionalBudget/createAdditionalBudgetRequest'
import { withErrorHandler } from '../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  const body = await readBody<CreateAdditionalBudgetRequest>(event)

  if (!body.projectId || !body.amount || !body.reason) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields: projectId, amount, reason'
    })
  }

  if (body.amount <= 0) {
    throw createError({
      statusCode: 400,
      message: 'Amount must be greater than 0'
    })
  }

  return await withErrorHandler(async () => {
    const budgetService = new AdditionalBudgetService()
    const budget = await budgetService.create({
      projectId: body.projectId,
      amount: body.amount,
      reason: body.reason,
      approvedBy: body.approvedBy,
      approvedDate: body.approvedDate,
      status: body.status,
    })

    return {
      success: true,
      budget,
    }
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to create additional budget'
  })
})
```

### PUT /api/additional-budgets/[id]
Create `server/api/additional-budgets/[id].put.ts`:

```typescript
import { AdditionalBudgetService } from '../../services/additionalBudget/AdditionalBudgetService'
import type { UpdateAdditionalBudgetRequest } from '../../types/additionalBudget/updateAdditionalBudgetRequest'
import { withErrorHandler } from '../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody<UpdateAdditionalBudgetRequest>(event)
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Budget ID is required'
    })
  }

  if (body.amount !== undefined && body.amount <= 0) {
    throw createError({
      statusCode: 400,
      message: 'Amount must be greater than 0'
    })
  }

  return await withErrorHandler(async () => {
    const budgetService = new AdditionalBudgetService()
    const budget = await budgetService.update(id, {
      amount: body.amount,
      reason: body.reason,
      approvedBy: body.approvedBy,
      approvedDate: body.approvedDate,
      status: body.status,
    })

    return {
      success: true,
      budget,
    }
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to update additional budget'
  })
})
```

### DELETE /api/additional-budgets/[id]
Create `server/api/additional-budgets/[id].delete.ts`:

```typescript
import { AdditionalBudgetService } from '../../services/additionalBudget/AdditionalBudgetService'
import { withErrorHandler } from '../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Budget ID is required'
    })
  }

  return await withErrorHandler(async () => {
    const budgetService = new AdditionalBudgetService()
    await budgetService.remove(id)

    return {
      success: true,
      message: 'Additional budget deleted successfully',
    }
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to delete additional budget'
  })
})
```

---

## Summary

After completing all steps, you'll have:

1. ✅ Database model in Prisma schema
2. ✅ Repository interface and implementation
3. ✅ Service layer with business logic
4. ✅ Serializer for data transformation
5. ✅ Type definitions
6. ✅ Complete CRUD API endpoints

### API Endpoints Available:
- `GET /api/additional-budgets` - List all additional budgets
- `GET /api/additional-budgets/[id]` - Get a specific budget
- `GET /api/additional-budgets/project/[projectId]` - Get budgets for a project
- `POST /api/additional-budgets/create` - Create a new budget
- `PUT /api/additional-budgets/[id]` - Update a budget
- `DELETE /api/additional-budgets/[id]` - Delete a budget

### Next Steps:
1. Run `npx prisma generate` and `npx prisma db push` to update the database
2. Test the API endpoints
3. Create frontend components to interact with these endpoints

