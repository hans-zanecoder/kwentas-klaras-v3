<template>
  <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-medium text-gray-500">{{ title }}</h3>
      <div v-if="icon" :class="`p-3 ${iconBgClasses} rounded-lg`">
        <div v-html="icon" :class="`w-6 h-6 ${iconColorClasses}`"></div>
      </div>
      <div v-else-if="$slots.icon" :class="`p-3 ${iconBgClasses} rounded-lg`">
        <slot name="icon" />
      </div>
    </div>
    <p class="text-3xl font-bold text-gray-900">{{ value }}</p>
    <p v-if="change" :class="changeClasses">
      <span class="font-medium">{{ change }}</span>
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

