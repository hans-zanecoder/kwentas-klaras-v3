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

