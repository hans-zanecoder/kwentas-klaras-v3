<template>
  <aside class="w-64 bg-white border-r border-gray-300 flex flex-col h-full">
    <div class="flex items-center justify-between h-16 px-6 border-b border-gray-300 flex-shrink-0">
      <h1 class="text-xl font-bold text-brand-blue">Admin Panel</h1>
    </div>
    <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
      <NuxtLink
        v-for="item in ADMIN_MENU"
        :key="item.path"
        :to="item.path"
        class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
        :class="isActive(item) ? 'bg-brand-blue/10 text-brand-blue' : 'text-gray-500 hover:bg-brand-blue/5 hover:text-brand-blue'"
      >
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <template v-if="Array.isArray(item.icon)">
            <path
              v-for="(path, index) in item.icon"
              :key="index"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :d="path"
            />
          </template>
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
        </svg>
        {{ item.label }}
      </NuxtLink>
      
      <div class="pt-4 border-t border-gray-200 mt-4">
        <button @click="handleLogout" class="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ADMIN_MENU } from '~/constants/admin/adminMenu'
import type { AdminMenuItem } from '~/types/admin/menu'

const route = useRoute()

const isActive = (item: AdminMenuItem): boolean => {
  return route.path === item.path || route.path.startsWith(item.path + '/')
}

const handleLogout = async () => {
  await navigateTo('/auth/login')
}
</script>

