import { useDisbursements } from './useDisbursements'
import type { DisbursementFormData } from '~/types/disbursement/disbursementForm'

export const useDisbursementForm = (projectId: string) => {
  const router = useRouter()
  const { createDisbursement, loading, saveError } = useDisbursements()

  const form = reactive<DisbursementFormData>({
    amount: 0,
    payee: '',
    reason: '',
    approvedBy: '',
    approvedDate: '',
  })

  const error = computed(() => saveError.value || '')

  const isFormValid = computed(() => {
    return form.amount > 0 && form.payee.trim().length > 0 && form.reason.trim().length > 0
  })

  const goBack = () => {
    router.push(`/admin/projects/${projectId}?tab=disbursements`)
  }

  const handleSubmit = async () => {
    if (!isFormValid.value) return

    await createDisbursement({
      projectId,
      amount: form.amount,
      payee: form.payee.trim(),
      reason: form.reason.trim(),
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
