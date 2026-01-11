import { useObligations } from './useObligations'
import type { ObligationFormData } from '~/types/obligation/obligationForm'
import { OBLIGATION_STATUS_OPTIONS } from '~/constants/obligation/status'

export const useObligationForm = (projectId: string) => {
  const router = useRouter()
  const { createObligation, loading, saveError } = useObligations()

  const form = reactive<ObligationFormData>({
    amount: 0,
    payee: '',
    reason: '',
    status: OBLIGATION_STATUS_OPTIONS[0]?.value || 'pending',
    approvedBy: '',
    approvedDate: '',
  })

  const error = computed(() => saveError.value || '')

  const isFormValid = computed(() => {
    return form.amount > 0 && form.payee.trim().length > 0 && form.reason.trim().length > 0
  })

  const goBack = () => {
    router.push(`/admin/projects/${projectId}?tab=obligations`)
  }

  const handleSubmit = async () => {
    if (!isFormValid.value) return

    await createObligation({
      projectId,
      amount: form.amount,
      payee: form.payee.trim(),
      reason: form.reason.trim(),
      status: form.status,
      approvedBy: form.approvedBy?.trim() || undefined,
      approvedDate: form.approvedDate ? new Date(form.approvedDate) : undefined,
    })
  }

  return {
    form,
    loading,
    error,
    isFormValid,
    goBack,
    handleSubmit,
  }
}
