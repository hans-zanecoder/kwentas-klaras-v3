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

