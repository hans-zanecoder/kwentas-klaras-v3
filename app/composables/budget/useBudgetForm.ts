import { useAdditionalBudgets } from '../additionalBudget/useAdditionalBudgets'
import type { BudgetFormData } from '~/types/budget/budgetForm'
import { BUDGET_STATUS_OPTIONS } from '~/constants/additionalBudget/status'

export const useBudgetForm = (projectId: string) => {
  const router = useRouter()
  const { createBudget, loading, saveError } = useAdditionalBudgets()

  const form = reactive<BudgetFormData>({
    amount: 0,
    reason: '',
    status: BUDGET_STATUS_OPTIONS[0]?.value || 'pending',
    approvedBy: '',
    approvedDate: '',
  })

  const error = computed(() => saveError.value || '')

  const isFormValid = computed(() => {
    return form.amount > 0 && form.reason.trim().length > 0
  })

  const goBack = () => {
    router.push(`/admin/projects/${projectId}?tab=budget`)
  }

  const handleSubmit = async () => {
    if (!isFormValid.value) return

    await createBudget({
      projectId,
      amount: form.amount,
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
