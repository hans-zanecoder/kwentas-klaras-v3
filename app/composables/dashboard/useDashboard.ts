import { DASHBOARD_ACTIVITIES } from '~/constants/dashboard/activities'
import { DASHBOARD_QUICK_ACTIONS } from '~/constants/dashboard/quickActions'
import type { QuickAction } from '~/types/ui/quickActions'

export const useDashboard = () => {
  const activities = DASHBOARD_ACTIVITIES

  const quickActions: QuickAction[] = DASHBOARD_QUICK_ACTIONS.map((action, index) => {
    if (index === 0) {
      return { ...action, onClick: () => navigateTo('/admin/projects') }
    }
    if (index === 1) {
      return { ...action, onClick: () => navigateTo('/admin/users') }
    }
    return action
  })

  const handleViewAll = () => {
    // Handle view all action
    console.log('View all activities')
  }

  return {
    activities,
    quickActions,
    handleViewAll,
  }
}

