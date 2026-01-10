<template>
  <Transition name="overlay-fade">
    <div
      v-if="!collapsed && isMobile"
      class="fixed inset-0 bg-black/50 z-30 lg:hidden"
      @click="toggleCollapse"
    ></div>
  </Transition>

  <button
    v-if="collapsed && isMobile"
    @click="toggleCollapse"
    class="fixed left-0 top-1/2 z-50 lg:hidden w-10 h-10 flex items-center justify-center bg-gray-900 border border-gray-800 rounded-r-lg shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all duration-300"
    style="transform: translateY(-50%)"
    aria-label="Open menu"
  >
    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
    </svg>
  </button>

  <aside
    :class="[
      'fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-300 transition-all duration-300 ease-in-out flex flex-col overflow-hidden',
      collapsed && !isMobile ? 'w-16' : 'w-64',
      collapsed && isMobile ? '-translate-x-full' : 'translate-x-0',
    ]"
  >
    <div
      :class="[
        'relative flex h-16 items-center border-b border-gray-300',
        collapsed && !isMobile ? 'justify-center px-4' : 'px-6',
      ]"
    >
      <div
        v-if="!collapsed || isMobile"
        class="flex items-center gap-3 flex-1 min-w-0 overflow-hidden"
      >
        <h1 class="text-xl font-bold text-brand-blue flex-1 min-w-0 break-words">
          Admin Panel
        </h1>
        <button
          v-if="isMobile"
          @click="toggleCollapse"
          class="ml-auto flex justify-center items-center size-9 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors"
          title="Close sidebar"
          aria-label="Close sidebar"
        >
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <nav class="flex-1 overflow-y-auto overflow-x-hidden px-2 pt-2 pb-2">
      <ul class="space-y-1">
        <li v-for="item in ADMIN_MENU" :key="item.path">
      <NuxtLink
        :to="item.path"
            :class="[
              'w-full flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg focus:outline-none transition-colors',
              isItemActive(item)
                ? 'bg-brand-blue/10 text-brand-blue'
                : 'text-gray-500 hover:bg-brand-blue/5 hover:text-brand-blue',
              collapsed && !isMobile ? 'justify-center' : '',
            ]"
            @click="handleMobileNavClick"
      >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <span v-if="!collapsed || isMobile" class="flex-1">{{ item.label }}</span>
      </NuxtLink>
        </li>
      </ul>
    </nav>

    <div class="border-t border-gray-200">
      <div class="border-t border-gray-200 p-2">
        <button
          @click="handleLogout"
          :class="[
            'w-full flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg focus:outline-none transition-colors text-gray-500 hover:bg-red-50 hover:text-red-600',
            collapsed && !isMobile ? 'justify-center' : '',
          ]"
        >
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span v-if="!collapsed || isMobile" class="flex-1 text-left">Logout</span>
        </button>
      </div>
    </div>
  </aside>

  <button
    v-if="!isMobile"
    @click="toggleCollapse"
    :class="[
      'fixed z-50 hidden lg:flex justify-center items-center w-8 h-12 bg-gray-900 border border-gray-800 rounded-r-lg shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all duration-300',
      collapsed ? 'left-16' : 'left-64',
    ]"
    style="top: 50%; transform: translateY(-50%)"
    :title="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
    aria-label="Toggle sidebar"
  >
    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path v-if="collapsed" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>
  </button>

  <div
    :class="[
      'transition-all duration-300 hidden lg:block',
      collapsed && !isMobile ? 'w-16' : 'w-64',
    ]"
  ></div>
</template>

<script setup lang="ts">
import { ADMIN_MENU } from '~/constants/admin/adminMenu'
import type { AdminMenuItem } from '~/types/admin/menu'
import { useSidebar } from '~/composables/ui/useSidebar'
import { useSidebarStore } from '~/stores/sidebarStore'

const {
  collapsed,
  toggleCollapse,
  isItemActive,
  handleLogout,
} = useSidebar(ADMIN_MENU)

const sidebarStore = useSidebarStore()
const isMobile = ref(false)

const checkMobile = () => {
  if (process.client) {
    const wasMobile = isMobile.value
    isMobile.value = window.innerWidth < 1024

    if (isMobile.value) {
      sidebarStore.setCollapsed(true)
    } else {
      if (wasMobile) {
        const savedState = localStorage.getItem('sidebar-collapsed')
        if (savedState !== null) {
          sidebarStore.setCollapsed(JSON.parse(savedState))
        } else {
          sidebarStore.setCollapsed(false)
        }
      }
    }
  }
}

watch(isMobile, (newValue) => {
  if (newValue && !collapsed.value) {
    sidebarStore.setCollapsed(true)
  }
})

onMounted(() => {
  if (process.client) {
    sidebarStore.initialize()
    checkMobile()
    window.addEventListener('resize', checkMobile)
  }
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('resize', checkMobile)
}
})

const handleMobileNavClick = () => {
  if (isMobile.value && !collapsed.value) {
    toggleCollapse()
  }
}
</script>
