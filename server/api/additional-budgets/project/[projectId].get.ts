import { AdditionalBudgetService } from '../../../services/additionalBudget/AdditionalBudgetService'
import { withErrorHandler } from '../../../utils/errorHandler'

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

