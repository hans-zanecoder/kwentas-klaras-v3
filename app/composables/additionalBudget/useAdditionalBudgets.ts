import type { IAdditionalBudget } from '~/types/additionalBudget/additionalBudget'
import type { BudgetStatus } from '~/constants/additionalBudget/status'
import { useAuthHeaders } from '../auth/useAuthHeaders'

export const useAdditionalBudgets = () => {
  const budgets = ref<IAdditionalBudget[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const saveError = ref<string | null>(null)

  const fetchBudgets = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{ success: boolean; budgets: IAdditionalBudget[] }>('/api/additional-budgets')
      if (response.success) {
        budgets.value = response.budgets
      }
    } catch (err: any) {
      error.value = err?.data?.message || err?.message || 'Failed to fetch additional budgets'
    } finally {
      loading.value = false
    }
  }

  const fetchBudgetsByProject = async (projectId: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{ success: boolean; budgets: IAdditionalBudget[] }>(`/api/additional-budgets/project/${projectId}`)
      if (response.success) {
        // Update local state if fetching for a specific project
        budgets.value = response.budgets
        return response.budgets
      }
      return []
    } catch (err: any) {
      error.value = err?.data?.message || err?.message || 'Failed to fetch additional budgets'
      return []
    } finally {
      loading.value = false
    }
  }

  const createBudget = async (budgetData: {
    projectId: string
    amount: number
    reason: string
    approvedBy?: string
    approvedDate?: Date
    status?: BudgetStatus
  }) => {
    loading.value = true
    saveError.value = null

    try {
      const headers = await useAuthHeaders()
      const response = await $fetch<{ success: boolean; budget: IAdditionalBudget }>('/api/additional-budgets/create', {
        method: 'POST',
        headers,
        body: budgetData,
      })

      if (response.success) {
        budgets.value.push(response.budget)
        return response.budget
      }
    } catch (err: any) {
      saveError.value = err?.data?.message || err?.message || 'Failed to create additional budget'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    budgets: readonly(budgets),
    loading: readonly(loading),
    error: readonly(error),
    saveError,
    fetchBudgets,
    fetchBudgetsByProject,
    createBudget,
  }
}

