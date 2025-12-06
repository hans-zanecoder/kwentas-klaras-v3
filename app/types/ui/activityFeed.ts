import type { ActivityItemProps } from './activityItem'

export interface ActivityFeedProps {
  activities: Omit<ActivityItemProps, 'icon' | 'iconBgColor' | 'iconColor'>[]
  showViewAll?: boolean
  viewAllText?: string
}

