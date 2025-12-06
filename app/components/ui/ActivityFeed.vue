<template>
  <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900">Recent Activity</h3>
      <button
        v-if="showViewAll"
        class="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        @click="$emit('viewAll')"
      >
        {{ viewAllText }}
      </button>
    </div>
    <div class="space-y-4">
      <slot>
        <ActivityItem
          v-for="(activity, index) in activities"
          :key="index"
          :title="activity.title"
          :description="activity.description"
          :time="activity.time"
          :is-last="index === activities.length - 1"
        >
          <template #icon>
            <slot :name="`activity-icon-${index}`" />
          </template>
        </ActivityItem>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ActivityFeedProps } from '~/types/ui/activityFeed'

const props = withDefaults(defineProps<ActivityFeedProps>(), {
  showViewAll: true,
  viewAllText: 'View all',
})

defineEmits<{
  viewAll: []
}>()
</script>

