<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-300 animate-fade-in h-full">
    <div class="p-4 lg:p-6 border-b border-gray-300">
      <div class="flex items-center justify-between">
        <h2 class="text-lg lg:text-xl font-bold text-brand-blue tracking-tight">Recent Activity</h2>
      <button
        v-if="showViewAll"
          class="text-sm font-semibold underline text-brand-blue hover:text-brand-green transition-colors"
        @click="$emit('viewAll')"
      >
        {{ viewAllText }}
      </button>
    </div>
    </div>
    <div class="p-4 lg:p-6 flex flex-col">
      <template v-if="$slots.default">
        <div class="relative pl-4">
          <div class="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-blue/30 to-brand-green/30 rounded-full"></div>
          <div class="space-y-4 lg:space-y-6">
        <slot />
          </div>
        </div>
      </template>
      <template v-else-if="activities && activities.length > 0">
        <div class="relative pl-4">
          <div class="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-blue/30 to-brand-green/30 rounded-full"></div>
          <div class="space-y-4 lg:space-y-6">
        <ActivityItem
          v-for="(activity, index) in activities"
          :key="index"
          :title="activity.title"
          :description="activity.description"
          :time="activity.time"
              icon-bg-color="bg-brand-blue/10"
              icon-color="text-brand-blue"
            />
          </div>
        </div>
      </template>
      <div v-else class="flex items-center justify-center py-12">
        <div class="text-center">
          <div class="w-16 h-16 mx-auto mb-4 bg-brand-blue/10 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">No Activity Yet</h3>
          <p class="text-sm text-gray-500">Activity will appear here as you use the app</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ActivityItem from '~/components/ui/ActivityItem.vue'
import type { ActivityFeedProps } from '~/types/ui/activityFeed'

const props = withDefaults(defineProps<ActivityFeedProps>(), {
  showViewAll: true,
  viewAllText: 'View all',
})

defineEmits<{
  viewAll: []
}>()
</script>

