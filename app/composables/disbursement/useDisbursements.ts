import type { IDisbursement } from '~/types/disbursement/disbursement'

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
    status?: 'pending' | 'approved' | 'denied'
  }) => {
    loading.value = true
    saveError.value = null

    try {
      const response = await $fetch<{ success: boolean; disbursement: IDisbursement }>('/api/disbursements/create', {
        method: 'POST',
        body: disbursementData,
      })

      if (response.success) {
        disbursements.value.push(response.disbursement)
        return response.disbursement
      }
    } catch (err: any) {
      saveError.value = err?.data?.message || err?.message || 'Failed to create disbursement'
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
  }
}

