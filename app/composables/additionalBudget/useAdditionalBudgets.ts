import type { IAdditionalBudget } from '~/types/additionalBudget/additionalBudget'

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
    status?: 'pending' | 'approved' | 'rejected'
  }) => {
    loading.value = true
    saveError.value = null

    try {
      const response = await $fetch<{ success: boolean; budget: IAdditionalBudget }>('/api/additional-budgets/create', {
        method: 'POST',
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

