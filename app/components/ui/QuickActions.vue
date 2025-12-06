<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-300 animate-fade-in flex flex-col h-full">
    <div class="p-4 lg:p-6 border-b border-gray-300">
      <h2 class="text-lg lg:text-xl font-bold text-brand-blue tracking-tight">{{ title || 'Quick Actions' }}</h2>
    </div>
    <div class="p-4 lg:p-6">
    <div class="space-y-3">
      <Button
        v-for="(action, index) in actions"
        :key="index"
        :variant="action.variant || 'secondary'"
          class="w-full justify-start text-left"
        @click="action.onClick"
      >
          <span class="flex items-center gap-2">
          <slot :name="`icon-${index}`" />
            <span>{{ action.label }}</span>
        </span>
      </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QuickActionsProps } from '~/types/ui/quickActions'

withDefaults(defineProps<QuickActionsProps>(), {
  title: 'Quick Actions',
})
</script>

