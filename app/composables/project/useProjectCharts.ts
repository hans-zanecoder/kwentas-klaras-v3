import type { Ref } from 'vue'
import type { Project } from '~/types/project/project'
import { useProjectFormatting } from './useProjectFormatting'

// Helper function matching useProjectFinancials.getTotalBudget logic (single source of truth)
const getTotalBudget = (project: Project | null): number => {
  if (!project) return 0
  return project.appropriation + (project.totalAddedBudget || 0)
}

// Helper function matching useProjectFinancials.formatUtilizationRate logic (single source of truth)
const formatUtilizationRate = (rate: number): string => {
  if (rate === 0) return '0.00'
  if (rate < 0.01) {
    return rate.toFixed(4)
  }
  return rate.toFixed(2)
}

export const useProjectCharts = (
  project: Ref<Project | null>,
  approvedDisbursements: Ref<number>
) => {
  const { formatNumber } = useProjectFormatting()

  const pieChartData = computed(() => {
    if (!project.value) return { series: [], options: {} }

    const totalBudget = getTotalBudget(project.value)

    if (totalBudget === 0) {
      return {
        series: [100],
        options: {
          chart: {
            type: 'pie',
            height: 350,
          },
          colors: ['#E5E7EB'],
          labels: ['No Budget'],
          legend: {
            position: 'bottom',
          },
          dataLabels: {
            enabled: true,
            formatter: () => '0%',
          },
        },
      }
    }

    const approvedDisbursed = approvedDisbursements.value
    const remaining = Math.max(0, totalBudget - approvedDisbursed)

    const approvedPercentage = totalBudget > 0 ? (approvedDisbursed / totalBudget) * 100 : 0
    const remainingPercentage = totalBudget > 0 ? (remaining / totalBudget) * 100 : 100

    const series = approvedDisbursed > 0
      ? [Math.max(0.01, approvedPercentage), Math.min(99.99, remainingPercentage)]
      : [remainingPercentage]

    return {
      series,
      options: {
        chart: {
          type: 'pie',
          height: 350,
        },
        colors: approvedDisbursed > 0 ? ['#10B981', '#E5E7EB'] : ['#E5E7EB'],
        labels: approvedDisbursed > 0 ? ['Approved Disbursements', 'Remaining Budget'] : ['Remaining Budget'],
        legend: {
          position: 'bottom',
        },
        dataLabels: {
          enabled: true,
          formatter: (val: number) => {
            if (val < 0.1) return `${val.toFixed(4)}%`
            if (val < 1) return `${val.toFixed(2)}%`
            return `${val.toFixed(1)}%`
          },
        },
        tooltip: {
          y: {
            formatter: (val: number) => {
              const amount = totalBudget * (val / 100)
              return `₱${formatNumber(amount)} (${val.toFixed(2)}%)`
            },
          },
        },
      },
    }
  })

  const utilizationChartData = computed(() => {
    if (!project.value) return { series: [], options: {} }

    const totalBudget = getTotalBudget(project.value)

    if (totalBudget === 0) {
      return {
        series: [0, 100],
        options: {
          chart: {
            type: 'pie',
            height: 350,
          },
          colors: ['#E5E7EB', '#E5E7EB'],
          labels: ['Utilized', 'Available'],
          legend: {
            position: 'bottom',
          },
          dataLabels: {
            enabled: true,
            formatter: (val: number) => `${val.toFixed(1)}%`,
          },
        },
      }
    }

    const utilized = approvedDisbursements.value
    const available = Math.max(0, totalBudget - utilized)

    const utilizationRate = totalBudget > 0 ? (utilized / totalBudget) * 100 : 0
    const availableRate = totalBudget > 0 ? (available / totalBudget) * 100 : 100

    const series = utilized > 0
      ? [Math.max(0.01, utilizationRate), Math.min(99.99, availableRate)]
      : [0, 100]

    return {
      series,
      options: {
        chart: {
          type: 'pie',
          height: 350,
        },
        colors: utilized > 0 ? ['#10B981', '#E5E7EB'] : ['#E5E7EB', '#E5E7EB'],
        labels: ['Utilized', 'Available'],
        legend: {
          position: 'bottom',
        },
        dataLabels: {
          enabled: true,
          formatter: (val: number) => {
            if (val < 0.1) return `${val.toFixed(4)}%`
            if (val < 1) return `${val.toFixed(2)}%`
            return `${val.toFixed(1)}%`
          },
        },
        tooltip: {
          y: {
            formatter: (val: number) => {
              const amount = totalBudget * (val / 100)
              return `₱${formatNumber(amount)} (${val.toFixed(2)}%)`
            },
          },
        },
      },
      utilizationRate: utilizationRate.toFixed(2),
    }
  })

  return {
    pieChartData,
    utilizationChartData,
    formatUtilizationRate, // Exported for use in pages (matches useProjectFinancials logic)
  }
}
