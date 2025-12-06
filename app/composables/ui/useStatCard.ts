import { computed } from 'vue'
import type { StatCardProps } from '~/types/ui/statCard'

export const useStatCard = (props: StatCardProps) => {
  const changeClasses = computed(() => {
    const base = 'text-sm mt-2'
    if (props.changeType === 'positive') {
      return `${base} text-green-600`
    }
    if (props.changeType === 'negative') {
      return `${base} text-red-600`
    }
    return `${base} text-gray-600`
  })

  const iconBgClasses = computed(() => {
    return props.iconBgColor || 'bg-blue-100'
  })

  const iconColorClasses = computed(() => {
    return props.iconColor || 'text-blue-600'
  })

  return {
    changeClasses,
    iconBgClasses,
    iconColorClasses,
  }
}

