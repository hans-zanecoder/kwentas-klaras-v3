import { useAdditionalBudgets } from '../additionalBudget/useAdditionalBudgets'
import { useObligations } from '../obligation/useObligations'
import { useDisbursements } from '../disbursement/useDisbursements'
import type { Project } from '~/types/project/project'
import type { IAdditionalBudget } from '~/types/additionalBudget/additionalBudget'
import type { IObligation } from '~/types/obligation/obligation'
import type { IDisbursement } from '~/types/disbursement/disbursement'

export const useProjectFinancials = (projectId: string | Ref<string | null>) => {
  const { fetchBudgetsByProject } = useAdditionalBudgets()
  const { fetchObligationsByProject } = useObligations()
  const { fetchDisbursementsByProject } = useDisbursements()

  const additionalBudgets = ref<IAdditionalBudget[]>([])
  const obligations = ref<IObligation[]>([])
  const disbursements = ref<IDisbursement[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const loadFinancials = async () => {
    const id = unref(projectId)
    if (!id) return

    loading.value = true
    error.value = null

    try {
      const [budgets, obligationsList, disbursementsList] = await Promise.all([
        fetchBudgetsByProject(id),
        fetchObligationsByProject(id),
        fetchDisbursementsByProject(id),
      ])

      additionalBudgets.value = budgets
      obligations.value = obligationsList
      disbursements.value = disbursementsList
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load financial data'
      error.value = errorMessage
    } finally {
      loading.value = false
    }
  }

  const totalAddedBudget = computed(() => {
    return additionalBudgets.value.reduce((sum, budget) => sum + (budget.amount || 0), 0)
  })

  const totalObligations = computed(() => {
    return obligations.value.reduce((sum, obligation) => sum + (obligation.amount || 0), 0)
  })

  const totalDisbursements = computed(() => {
    return disbursements.value.reduce((sum, disbursement) => sum + (disbursement.amount || 0), 0)
  })

  const approvedDisbursements = computed(() => {
    return disbursements.value
      .filter(d => d.status === 'approved')
      .reduce((sum, d) => sum + (d.amount || 0), 0)
  })

  const pendingDisbursements = computed(() => {
    return disbursements.value
      .filter(d => d.status === 'pending')
      .reduce((sum, d) => sum + (d.amount || 0), 0)
  })

  /**
   * Calculate total budget (appropriation + total added budget)
   * Mirrors: ComputationService (backend is source of truth)
   * Formula: appropriation + totalAddedBudget
   */
  const getTotalBudget = (project: Project | null): number => {
    if (!project) return 0
    return project.appropriation + (project.totalAddedBudget || 0)
  }

  /**
   * Calculate remaining balance
   * Mirrors: ComputationService.calculateRemainingBalance() (backend is source of truth)
   * Formula: appropriation + totalAddedBudget - totalDisbursements
   * Equivalent to: totalBudget - totalDisbursements
   */
  const getRemainingBalance = (project: Project | null): number => {
    if (!project) return 0
    const totalBudget = getTotalBudget(project)
    return totalBudget - totalDisbursements.value
  }

  /**
   * Calculate remaining obligations
   * Mirrors: ComputationService.calculateRemainingObligations() (backend is source of truth)
   * Formula: Math.max(0, totalObligations - approvedDisbursements)
   */
  const remainingObligations = computed(() => {
    return Math.max(0, totalObligations.value - approvedDisbursements.value)
  })

  /**
   * Calculate utilization rate
   * Mirrors: ComputationService.calculateUtilizationRate() (backend is source of truth)
   * Formula: (approvedDisbursements / totalBudget) * 100
   */
  const getUtilizationRate = (project: Project | null): number => {
    if (!project) return 0
    const totalBudget = getTotalBudget(project)
    if (totalBudget === 0) return 0
    return (approvedDisbursements.value / totalBudget) * 100
  }

  const formatUtilizationRate = (rate: number): string => {
    if (rate === 0) return '0.00'
    if (rate < 0.01) {
      return rate.toFixed(4)
    }
    return rate.toFixed(2)
  }

  // Legacy computed for backward compatibility
  const utilizationRate = computed(() => {
    return (project: Project | null) => getUtilizationRate(project)
  })

  return {
    additionalBudgets: readonly(additionalBudgets),
    obligations: readonly(obligations),
    disbursements: readonly(disbursements),
    loading: readonly(loading),
    error: readonly(error),
    loadFinancials,
    totalAddedBudget,
    totalObligations,
    totalDisbursements,
    approvedDisbursements,
    pendingDisbursements,
    getTotalBudget,
    getRemainingBalance,
    remainingObligations,
    getUtilizationRate,
    formatUtilizationRate,
    utilizationRate, // Legacy - kept for backward compatibility
  }
}

