<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-300 animate-fade-in p-3">
    <div class="flex items-center justify-between mb-1.5">
      <h3 class="text-xs font-medium text-gray-500">{{ title }}</h3>
      <div v-if="icon" :class="`p-1.5 ${iconBgClasses} rounded-lg`">
        <div v-html="icon" :class="`w-4 h-4 ${iconColorClasses}`"></div>
      </div>
      <div v-else-if="$slots.icon" :class="`p-1.5 ${iconBgClasses} rounded-lg`">
        <slot name="icon" />
      </div>
    </div>
    <p class="text-xl font-bold text-gray-900 mb-0.5">{{ value }}</p>
    <p v-if="change" :class="changeClasses">
      <span class="text-xs font-medium">{{ change }}</span>
    </p>
    <slot name="footer" />
  </div>
</template>

<script setup lang="ts">
import type { StatCardProps } from '~/types/ui/statCard'
import { useStatCard } from '~/composables/ui/useStatCard'

const props = withDefaults(defineProps<StatCardProps>(), {
  changeType: 'positive',
  iconBgColor: 'bg-blue-100',
  iconColor: 'text-blue-600',
})

const { changeClasses, iconBgClasses, iconColorClasses } = useStatCard(props)
</script>

