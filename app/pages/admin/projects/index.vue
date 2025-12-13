<template>
  <div class="h-screen bg-brand-bg flex overflow-hidden">
    <AdminSidebar />
    
    <main class="flex-1 flex flex-col overflow-hidden">
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-brand-bg">
        <div class="space-y-8 min-h-screen">
          <PageHeader
            :title="PAGE_HEADERS.projects.title"
            :description="PAGE_HEADERS.projects.description"
            :button-text="PAGE_HEADERS.projects.buttonText"
            :button-action="handleAddProject"
            :stats="headerStats"
          >
            <template #icon-0="{ stat }">
              <svg :class="`w-5 h-5 ${getStatIconColor(stat.color)}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </template>
            <template #icon-1="{ stat }">
              <svg :class="`w-5 h-5 ${getStatIconColor(stat.color)}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </template>
          </PageHeader>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
            <StatCard
              v-for="(stat, index) in projectStats"
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
                <svg v-else-if="index === 2" :class="`w-6 h-6 ${stat.iconColor}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <svg v-else :class="`w-6 h-6 ${stat.iconColor}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </template>
            </StatCard>
          </div>

          <section class="relative overflow-hidden rounded-2xl border border-gray-300 p-6 bg-white">
            <div class="mb-6 flex items-center justify-between">
              <div class="flex-1 max-w-md">
                <SearchInput
                  v-model="searchQuery"
                  placeholder="Search projects by name..."
                />
              </div>
            </div>

            <Table
              :columns="PROJECT_TABLE_COLUMNS"
              :data="[...filteredProjects]"
              key-field="id"
              empty-message="No projects found"
              empty-description="Try adjusting your search criteria."
            >
              <template #cell-name="{ row }">
                <div class="text-sm font-medium text-gray-900">{{ row.name }}</div>
                <div class="text-xs text-gray-500 mt-1 line-clamp-2">{{ row.services }}</div>
              </template>

              <template #cell-implementingUnit="{ row }">
                <span v-if="row.implementingUnit" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                  {{ row.implementingUnit }}
                </span>
                <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-500">
                  N/A
                </span>
              </template>

              <template #cell-appropriation="{ row }">
                <div class="text-sm text-gray-900">₱{{ formatNumber(row.appropriation) }}</div>
              </template>

              <template #cell-year="{ row }">
                <div class="text-sm text-gray-900">{{ row.year }}</div>
              </template>

              <template #cell-duration="{ row }">
                <div class="text-sm text-gray-900">
                  <template v-if="row.startDate || row.endDate">
                    {{ formatDate(row.startDate) }} - {{ formatDate(row.endDate) }}
                  </template>
                  <template v-else>
                    <span class="text-gray-400">No dates set</span>
                  </template>
                </div>
              </template>

              <template #cell-actions="{ row }">
                <div class="flex items-center justify-end space-x-2">
                  <button class="text-indigo-600 hover:text-indigo-900 transition cursor-pointer">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button @click="openEditModal(row)" class="text-gray-600 hover:text-gray-900 transition cursor-pointer">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button @click="handleDelete(row)" class="text-red-600 hover:text-red-900 transition cursor-pointer">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </template>
            </Table>

            <div v-if="filteredProjects.length > 0" class="mt-6 flex items-center justify-between">
              <div class="text-sm text-gray-700">
                Showing <span class="font-medium">{{ filteredProjects.length }}</span> of <span class="font-medium">{{ projects.length }}</span> projects
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>

    <ProjectsAddOrCreateProject
      v-if="editingProject"
      :is-open="isModalOpen"
      :editing-project="editingProject"
      @close="closeModal"
      @save="onSaveProject"
    />

    <div v-if="saveError" class="fixed top-4 right-4 z-[10000]">
      <ErrorMessage :message="saveError" />
    </div>
  </div>
</template>

<script setup lang="ts">
import StatCard from '~/components/ui/StatCard.vue'
import PageHeader from '~/components/ui/PageHeader.vue'
import SearchInput from '~/components/ui/SearchInput.vue'
import Table from '~/components/ui/Table.vue'
import ErrorMessage from '~/components/ui/ErrorMessage.vue'
import { PROJECT_TABLE_COLUMNS } from '~/constants/project/tableColumns'
import { PAGE_HEADERS } from '~/constants/pages/headers'
import { getStatIconColor, getIconBgColor } from '~/constants/ui/statColors'
import { useProjects } from '~/composables/project/useProjects'
import { useProjectSearch } from '~/composables/project/useProjectSearch'
import { useProjectModal } from '~/composables/project/useProjectModal'
import { useProjectFormatting } from '~/composables/project/useProjectFormatting'

const searchQuery = ref('')

const { projects, saveError, projectStats, fetchProjects, handleSaveProject, handleDelete } = useProjects()
const { filteredProjects } = useProjectSearch(projects, searchQuery)
const { isModalOpen, editingProject, openEditModal, closeModal } = useProjectModal(saveError)
const { formatNumber, formatDate } = useProjectFormatting()

onMounted(async () => {
  await fetchProjects()
})

const onSaveProject = async (projectData: any) => {
  await handleSaveProject(projectData, editingProject.value)
  closeModal()
}

const headerStats = computed(() => {
  return projectStats.value.slice(0, 2).map((stat, index) => ({
    ...stat,
    iconIndex: index
  }))
})

const router = useRouter()

const handleAddProject = () => {
  router.push('/admin/projects/add')
}
</script>
