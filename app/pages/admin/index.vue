<template>
  <div class="h-screen bg-brand-bg flex overflow-hidden">
    <AdminSidebar />
    
    <main class="flex-1 flex flex-col overflow-hidden">
      <AdminHeader title="Dashboard" subtitle="Welcome back, Admin" />
      
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-brand-bg">
        <div class="space-y-8 min-h-screen">
          <section class="relative overflow-hidden rounded-2xl border border-gray-300 p-0 mb-4 animate-fade-in">
            <div class="absolute inset-0 bg-white"></div>
            <div class="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-0 items-stretch">
              <div class="col-span-2 flex flex-col justify-center px-4 lg:px-6 py-4 lg:py-6 md:py-8">
                <h1 class="text-xl lg:text-2xl md:text-3xl font-extrabold text-brand-blue mb-2 lg:mb-3 tracking-tight text-left">
                  Welcome back, Admin!
                </h1>
                <p class="text-sm text-brand-green mb-4 lg:mb-5 max-w-2xl font-normal leading-relaxed text-left">
                  Here's what's happening with your platform today.
                </p>
                <button
                  type="button"
                  @click="navigateTo('/admin/projects')"
                  style="background-color: #2563EB;"
                  class="mt-2 flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:[background-color:#22C98D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 w-fit"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>New Project</span>
                </button>
              </div>
              <div v-if="stats.length > 0" class="flex flex-col gap-0 justify-center px-6 py-6 md:py-8 bg-gradient-to-br from-[#ede9fe] via-[#f3e8ff] to-[#e0e7ff] rounded-2xl md:rounded-l-none md:rounded-r-2xl">
                <div class="flex flex-col gap-0 divide-y divide-[#e0e7ff]">
                  <div v-for="(stat, index) in stats.slice(0, 2)" :key="index" class="flex items-center gap-4 py-4">
                    <div class="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm">
                      <svg v-if="index === 0" :class="`w-5 h-5 ${getStatIconColor(stat.color)}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <svg v-else :class="`w-5 h-5 ${getStatIconColor(stat.color)}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <div class="text-xl font-bold text-gray-900 flex items-center gap-2">
                        {{ stat.value }}
                      </div>
                      <div class="flex items-center gap-1 mt-0.5">
                        <span :class="['text-xs font-semibold', stat.changeType === 'positive' ? 'text-brand-green' : stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-500']">
                          <span v-if="stat.changeType === 'positive'">▲</span>
                          <span v-else-if="stat.changeType === 'negative'">▼</span>
                          <span v-else>-</span>
                          {{ stat.change }}
                        </span>
                        <span class="text-xs text-gray-400 ml-1">from last month</span>
                      </div>
                      <div class="text-gray-500 text-xs font-medium">{{ stat.title }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
            <StatCard
              v-for="(stat, index) in stats"
              :key="index"
              :title="stat.title"
              :value="stat.value"
              :change="`${stat.change} from last month`"
              :change-type="stat.changeType"
              :icon-bg-color="getIconBgColor(stat.color)"
              :icon-color="stat.iconColor"
            >
              <template #icon>
                <svg v-if="index === 0" :class="`w-6 h-6 ${stat.iconColor}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <svg v-else-if="index === 1" :class="`w-6 h-6 ${stat.iconColor}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <svg v-else-if="index === 2" :class="`w-6 h-6 ${stat.iconColor}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg v-else :class="`w-6 h-6 ${stat.iconColor}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </template>
            </StatCard>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
            <div class="lg:col-span-2">
              <PieChart
                title="Utilization Rate"
                :series="chartSeries"
                :options="chartOptions"
              />
            </div>
            <div class="lg:col-span-1">
              <ActivityFeed :activities="activities" @view-all="handleViewAll" />
            </div>
          </div>
          </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import StatCard from '~/components/ui/StatCard.vue'
import ActivityFeed from '~/components/ui/ActivityFeed.vue'
import PieChart from '~/components/ui/PieChart.vue'
import { useDashboard } from '~/composables/dashboard/useDashboard'
import { useUtilizationRate } from '~/composables/dashboard/useUtilizationRate'

const { activities, handleViewAll } = useDashboard()
const { chartOptions, chartSeries } = useUtilizationRate()

const stats = [
  {
    title: 'Total Users',
    value: '1234',
    change: '12.5%',
    changeType: 'positive' as 'positive' | 'negative' | 'neutral',
    iconColor: 'text-brand-blue',
    color: 'blue'
  },
  {
    title: 'Active Projects',
    value: '56',
    change: '8 new',
    changeType: 'positive' as 'positive' | 'negative' | 'neutral',
    iconColor: 'text-purple-600',
    color: 'purple'
  },
  {
    title: 'Revenue',
    value: '$45.2k',
    change: '23.1%',
    changeType: 'positive' as 'positive' | 'negative' | 'neutral',
    iconColor: 'text-brand-green',
    color: 'green'
  },
  {
    title: 'Tasks Completed',
    value: '892',
    change: '78%',
    changeType: 'neutral' as 'positive' | 'negative' | 'neutral',
    iconColor: 'text-orange-600',
    color: 'orange'
  }
]

const getStatIconColor = (color: string) => {
  switch (color) {
    case 'blue':
      return 'text-brand-blue'
    case 'purple':
      return 'text-purple-600'
    case 'green':
      return 'text-brand-green'
    case 'orange':
      return 'text-orange-600'
    default:
      return 'text-gray-500'
  }
}

const getIconBgColor = (color: string) => {
  switch (color) {
    case 'blue':
      return 'bg-brand-blue/10'
    case 'purple':
      return 'bg-purple-100'
    case 'green':
      return 'bg-brand-green/10'
    case 'orange':
      return 'bg-orange-100'
    default:
      return 'bg-gray-100'
  }
}
</script>

