import type { IDisbursement } from '~/types/disbursement/disbursement'
import type { DisbursementStatus } from '~/constants/disbursement/status'
import { useAuthHeaders } from '../auth/useAuthHeaders'

export const useDisbursements = () => {
  const disbursements = ref<IDisbursement[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const saveError = ref<string | null>(null)

  const fetchDisbursements = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{ success: boolean; disbursements: IDisbursement[] }>('/api/disbursements')
      if (response.success) {
        disbursements.value = response.disbursements
      }
    } catch (err: any) {
      error.value = err?.data?.message || err?.message || 'Failed to fetch disbursements'
    } finally {
      loading.value = false
    }
  }

  const fetchDisbursementsByProject = async (projectId: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{ success: boolean; disbursements: IDisbursement[] }>(`/api/disbursements/project/${projectId}`)
      if (response.success) {
        // Update local state if fetching for a specific project
        disbursements.value = response.disbursements
        return response.disbursements
      }
      return []
    } catch (err: any) {
      error.value = err?.data?.message || err?.message || 'Failed to fetch disbursements'
      return []
    } finally {
      loading.value = false
    }
  }

  const createDisbursement = async (disbursementData: {
    projectId: string
    amount: number
    reason: string
    payee: string
    approvedBy?: string
    approvedDate?: Date
    status?: DisbursementStatus
  }) => {
    loading.value = true
    saveError.value = null

    try {
      const headers = await useAuthHeaders()
      const response = await $fetch<{ success: boolean; disbursement: IDisbursement }>('/api/disbursements/create', {
        method: 'POST',
        headers,
        body: disbursementData,
      })

      if (response.success) {
        // Add to local state
        const index = disbursements.value.findIndex(d => d.id === response.disbursement.id)
        if (index === -1) {
          disbursements.value.push(response.disbursement)
        } else {
          disbursements.value[index] = response.disbursement
        }
        return response.disbursement
      }
    } catch (err: any) {
      saveError.value = err?.data?.message || err?.message || 'Failed to create disbursement'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateStatus = async (
    id: string,
    status: DisbursementStatus,
    approvedBy?: string,
    approvedDate?: Date
  ) => {
    loading.value = true
    saveError.value = null

    try {
      const headers = await useAuthHeaders()
      const response = await $fetch<{ success: boolean; disbursement: IDisbursement }>(`/api/disbursements/${id}`, {
        method: 'PUT',
        headers,
        body: {
          status,
          approvedBy,
          approvedDate: approvedDate?.toISOString(),
        },
      })

      if (response.success) {
        const index = disbursements.value.findIndex(d => d.id === id)
        if (index !== -1) {
          disbursements.value[index] = response.disbursement
        }
        return response.disbursement
      }
    } catch (err: any) {
      saveError.value = err?.data?.message || err?.message || 'Failed to update disbursement status'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    disbursements: readonly(disbursements),
    loading: readonly(loading),
    error: readonly(error),
    saveError,
    fetchDisbursements,
    fetchDisbursementsByProject,
    createDisbursement,
    updateStatus,
  }
}

