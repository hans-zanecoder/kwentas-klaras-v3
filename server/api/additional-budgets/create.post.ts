import { AdditionalBudgetService } from '../../services/additionalBudget/AdditionalBudgetService'
import type { CreateAdditionalBudgetRequest } from '../../types/additionalBudget/createAdditionalBudgetRequest'
import { requireAuth } from '../../utils/auth'
import { requireCSRF } from '../../utils/csrfMiddleware'
import { sanitizeString, sanitizeNumber } from '../../utils/sanitize'
import { withErrorHandler } from '../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  await requireCSRF(event)
  
  const body = await readBody<CreateAdditionalBudgetRequest>(event)

  const sanitizedBody = {
    projectId: sanitizeString(body.projectId),
    amount: sanitizeNumber(body.amount),
    reason: sanitizeString(body.reason),
    approvedBy: body.approvedBy ? sanitizeString(body.approvedBy) : undefined,
    approvedDate: body.approvedDate,
    status: body.status ? sanitizeString(body.status) : undefined,
  };

  if (!sanitizedBody.projectId || sanitizedBody.amount === null || !sanitizedBody.reason) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields: projectId, amount, reason'
    })
  }

  if (sanitizedBody.amount <= 0) {
    throw createError({
      statusCode: 400,
      message: 'Amount must be greater than 0'
    })
  }

  return await withErrorHandler(async () => {
    const budgetService = new AdditionalBudgetService()
    const budget = await budgetService.create({
      projectId: sanitizedBody.projectId,
      amount: sanitizedBody.amount as number,
      reason: sanitizedBody.reason,
      approvedBy: sanitizedBody.approvedBy,
      approvedDate: sanitizedBody.approvedDate,
      status: sanitizedBody.status,
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

