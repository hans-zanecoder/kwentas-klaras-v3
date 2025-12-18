<template>
  <div class="h-screen bg-brand-bg flex overflow-hidden">
    <AdminSidebar />
    
    <main class="flex-1 flex flex-col overflow-hidden">
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-brand-bg">
        <div class="space-y-6 min-h-full flex flex-col">
          <div class="flex items-center justify-between">
            <h1 class="text-2xl font-semibold text-gray-900">All Projects</h1>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                <button
                  @click="filterType = PROJECT_FILTER_TYPES.ALL"
                  :class="[
                    'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                    filterType === PROJECT_FILTER_TYPES.ALL
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  ]"
                >
                  All
                </button>
                <button
                  @click="filterType = PROJECT_FILTER_TYPES.CURRENT"
                  :class="[
                    'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                    filterType === PROJECT_FILTER_TYPES.CURRENT
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  ]"
                >
                  Current Projects
              </button>
                <button
                  @click="filterType = PROJECT_FILTER_TYPES.CONTINUING"
                  :class="[
                    'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                    filterType === PROJECT_FILTER_TYPES.CONTINUING
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  ]"
                >
                  Continuing Projects
              </button>
              </div>
              <div class="flex-1 max-w-md ml-4">
                <SearchInput
                  v-model="searchQuery"
                  placeholder="Search by project name or code..."
                />
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            <StatCard
              v-for="(stat, index) in displayStats"
                :key="index"
              :title="stat.title"
              :value="stat.value"
              :change="stat.change"
              :change-type="stat.changeType"
              :icon-bg-color="getIconBgColor(stat.color)"
              :icon-color="stat.iconColor"
            >
              <template #icon>
                  <svg v-if="index === 0" :class="`w-6 h-6 ${stat.iconColor}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <svg v-else-if="index === 1" :class="`w-6 h-6 ${stat.iconColor}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                <svg v-else :class="`w-6 h-6 ${stat.iconColor}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
              </template>
            </StatCard>
          </div>

          <section class="relative overflow-hidden rounded-2xl border border-gray-300 p-6 bg-white flex-1 min-h-[600px] flex flex-col">

            <div v-if="filteredProjects.length === 0" class="text-center py-12 flex-1 flex items-center justify-center">
              <div class="text-gray-400 mb-2">
                <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
              </div>
              <p class="text-gray-600 font-medium">No projects found</p>
              <p class="text-sm text-gray-500 mt-1">Try adjusting your search criteria.</p>
            </div>

            <div v-else class="space-y-2 flex-1">
              <div
                v-for="project in filteredProjects"
                :key="project.id"
                class="project-card bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-all duration-200 hover:border-indigo-300"
              >
                <div class="flex items-center justify-between gap-6">
                  <div class="flex-1 grid grid-cols-12 gap-3 items-center">
                    <div class="col-span-2">
                      <div class="text-lg font-semibold text-gray-900 mb-1">{{ project.name }}</div>
                      <div class="text-xs text-gray-500">Code: {{ project.code || 'N/A' }}</div>
                    </div>
                    <div class="col-span-2">
                      <div class="text-xs text-gray-500 mb-1.5">Implementing Unit</div>
                      <div>
                        <span v-if="project.implementingUnit" class="inline-flex text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800">
                          {{ project.implementingUnit }}
                        </span>
                        <span v-else class="text-xs text-gray-400">N/A</span>
                      </div>
                    </div>
                    <div class="col-span-2">
                      <div class="text-xs text-gray-500 mb-1.5">Location</div>
                      <div class="text-sm font-medium text-gray-900">{{ project.location || 'N/A' }}</div>
                    </div>
                    <div class="col-span-2">
                      <div class="text-xs text-gray-500 mb-1.5">Appropriation</div>
                      <div class="text-sm font-bold text-gray-900">₱{{ formatNumber(project.appropriation) }}</div>
                    </div>
                    <div class="col-span-1">
                      <div class="text-xs text-gray-500 mb-1.5">Year</div>
                      <div class="text-sm font-medium text-gray-900">{{ project.year }}</div>
                    </div>
                    <div class="col-span-3">
                      <div class="text-xs text-gray-500 mb-1.5">Duration</div>
                      <div class="text-sm text-gray-900 leading-tight">
                        <template v-if="project.startDate || project.endDate">
                          {{ formatDate(project.startDate) }} - {{ formatDate(project.endDate) }}
                        </template>
                        <template v-else>
                          <span class="text-gray-400">No dates</span>
                        </template>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center flex-shrink-0">
                    <button @click.stop="goToProject(project)" class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                      Go to Project
                    </button>
          </div>
                </div>
              </div>
            </div>

            <div v-if="filteredProjects.length > 0" class="mt-6 flex items-center justify-between">
              <div class="text-sm text-gray-700">
                Showing <span class="font-medium">{{ filteredProjects.length }}</span> of <span class="font-medium">{{ projects.length }}</span> projects
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>

    <div v-if="saveError" class="fixed top-4 right-4 z-[10000]">
      <ErrorMessage :message="saveError" />
    </div>
  </div>
</template>

<script setup lang="ts">
import StatCard from '~/components/ui/StatCard.vue'
import SearchInput from '~/components/ui/SearchInput.vue'
import ErrorMessage from '~/components/ui/ErrorMessage.vue'
import { useProjects } from '~/composables/project/useProjects'
import { useProjectSearch } from '~/composables/project/useProjectSearch'
import { useProjectFormatting } from '~/composables/project/useProjectFormatting'
import { PROJECT_FILTER_TYPES, type ProjectFilterType } from '~/constants/project/filterTypes'
import { getIconBgColor } from '~/constants/ui/statColors'

const searchQuery = ref('')
const filterType = ref<ProjectFilterType>(PROJECT_FILTER_TYPES.ALL)

const { projects, saveError, fetchProjects, projectStats } = useProjects()

const displayStats = computed(() => projectStats.value.slice(0, 3))
const { filteredProjects: searchFilteredProjects } = useProjectSearch(projects, searchQuery)
const { formatNumber, formatDate } = useProjectFormatting()

const filteredProjects = computed(() => {
  if (filterType.value === PROJECT_FILTER_TYPES.ALL) {
    return searchFilteredProjects.value
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return searchFilteredProjects.value.filter((project) => {
    if (!project.startDate || !project.endDate) return false

    const startDate = new Date(project.startDate)
    const endDate = new Date(project.endDate)
    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(0, 0, 0, 0)

    if (filterType.value === PROJECT_FILTER_TYPES.CURRENT) {
      return startDate <= today && endDate >= today
    }

    if (filterType.value === PROJECT_FILTER_TYPES.CONTINUING) {
      return endDate > today
    }

    return true
  })
})

onMounted(async () => {
  await fetchProjects()
})

const router = useRouter()

const goToProject = (project: any) => {
  router.push(`/admin/projects/${project.id}`)
}
</script>
