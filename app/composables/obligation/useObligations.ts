import type { IObligation } from '~/types/obligation/obligation'
import type { ObligationStatus } from '~/constants/obligation/status'
import { useAuthHeaders } from '../auth/useAuthHeaders'

export const useObligations = () => {
  const obligations = ref<IObligation[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const saveError = ref<string | null>(null)

  const fetchObligations = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{ success: boolean; obligations: IObligation[] }>('/api/obligations')
      if (response.success) {
        obligations.value = response.obligations
      }
    } catch (err: any) {
      error.value = err?.data?.message || err?.message || 'Failed to fetch obligations'
    } finally {
      loading.value = false
    }
  }

  const fetchObligationsByProject = async (projectId: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{ success: boolean; obligations: IObligation[] }>(`/api/obligations/project/${projectId}`)
      if (response.success) {
        // Update local state if fetching for a specific project
        obligations.value = response.obligations
        return response.obligations
      }
      return []
    } catch (err: any) {
      error.value = err?.data?.message || err?.message || 'Failed to fetch obligations'
      return []
    } finally {
      loading.value = false
    }
  }

  const createObligation = async (obligationData: {
    projectId: string
    amount: number
    reason: string
    payee: string
    approvedBy?: string
    approvedDate?: Date
    status?: ObligationStatus
  }) => {
    loading.value = true
    saveError.value = null

    try {
      const headers = await useAuthHeaders()
      const response = await $fetch<{ success: boolean; obligation: IObligation }>('/api/obligations/create', {
        method: 'POST',
        headers,
        body: obligationData,
      })

      if (response.success) {
        obligations.value.push(response.obligation)
        return response.obligation
      }
    } catch (err: any) {
      saveError.value = err?.data?.message || err?.message || 'Failed to create obligation'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    obligations: readonly(obligations),
    loading: readonly(loading),
    error: readonly(error),
    saveError,
    fetchObligations,
    fetchObligationsByProject,
    createObligation,
  }
}

