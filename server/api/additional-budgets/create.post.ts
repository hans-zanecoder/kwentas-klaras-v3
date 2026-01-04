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

