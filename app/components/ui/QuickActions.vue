<template>
  <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
    <h3 v-if="title" class="text-lg font-semibold text-gray-900 mb-6">{{ title }}</h3>
    <div class="space-y-3">
      <Button
        v-for="(action, index) in actions"
        :key="index"
        :variant="action.variant || 'secondary'"
        class="w-full"
        @click="action.onClick"
      >
        <span class="flex items-center justify-center">
          <slot :name="`icon-${index}`" />
          {{ action.label }}
        </span>
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QuickActionsProps } from '~/types/ui/quickActions'

withDefaults(defineProps<QuickActionsProps>(), {
  title: 'Quick Actions',
})
</script>

