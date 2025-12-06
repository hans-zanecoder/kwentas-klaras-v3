import { computed } from 'vue'
import type { ActivityItemProps } from '~/types/ui/activityItem'

export const useActivityItem = (props: ActivityItemProps) => {
  const iconBgClasses = computed(() => {
    return props.iconBgColor || 'bg-blue-100'
  })

  const iconColorClasses = computed(() => {
    return props.iconColor || 'text-blue-600'
  })

  return {
    iconBgClasses,
    iconColorClasses,
  }
}

