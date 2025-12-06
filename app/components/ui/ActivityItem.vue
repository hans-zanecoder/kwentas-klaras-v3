<template>
  <div class="flex items-start gap-3 relative">
    <div class="relative z-10 flex-shrink-0">
      <div v-if="icon" class="w-4 h-4 rounded-full flex items-center justify-center">
        <span class="text-xs">{{ icon }}</span>
    </div>
      <div v-else-if="$slots.icon" class="w-4 h-4 rounded-full flex items-center justify-center">
      <slot name="icon" />
      </div>
      <div v-else class="w-4 h-4 rounded-full flex items-center justify-center">
        <span class="text-xs">📋</span>
      </div>
    </div>
    <div class="flex-1 min-w-0">
      <p class="text-sm text-gray-900 font-medium leading-relaxed">{{ title }}</p>
      <p class="text-xs text-gray-500 mt-1">{{ description }}</p>
      <p class="text-xs text-gray-500 mt-1">{{ time }}</p>
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

