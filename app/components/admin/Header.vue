<template>
  <header class="bg-white border-b border-gray-300 sticky top-0 z-30">
    <div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
      <div class="flex-1 lg:flex-none">
        <h2 class="text-lg font-semibold text-brand-blue">{{ title || 'Dashboard' }}</h2>
        <p v-if="subtitle" class="text-sm text-brand-green mt-0.5">{{ subtitle }}</p>
      </div>
      <div class="flex items-center space-x-4">
        <button class="p-2 text-gray-400 hover:text-brand-blue hover:bg-gray-100 rounded-full transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        <div class="w-10 h-10 bg-brand-blue rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
          {{ userInitial || 'A' }}
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
  userInitial?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Dashboard',
  subtitle: 'Welcome back, Admin',
  userInitial: 'A'
})
</script>

