<template>
  <div class="flex items-start space-x-4" :class="isLast ? '' : 'pb-4 border-b border-gray-100'">
    <div v-if="icon" :class="`w-10 h-10 ${iconBgClasses} rounded-full flex items-center justify-center flex-shrink-0`">
      <div v-html="icon" :class="`w-5 h-5 ${iconColorClasses}`"></div>
    </div>
    <div v-else-if="$slots.icon" :class="`w-10 h-10 ${iconBgClasses} rounded-full flex items-center justify-center flex-shrink-0`">
      <slot name="icon" />
    </div>
    <div class="flex-1">
      <p class="text-sm font-medium text-gray-900">{{ title }}</p>
      <p class="text-xs text-gray-500">{{ description }}</p>
      <p class="text-xs text-gray-400 mt-1">{{ time }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ActivityItemProps } from '~/types/ui/activityItem'
import { useActivityItem } from '~/composables/ui/useActivityItem'

const props = withDefaults(defineProps<ActivityItemProps & { isLast?: boolean }>(), {
  iconBgColor: 'bg-blue-100',
  iconColor: 'text-blue-600',
  isLast: false,
})

const { iconBgClasses, iconColorClasses } = useActivityItem(props)
</script>

