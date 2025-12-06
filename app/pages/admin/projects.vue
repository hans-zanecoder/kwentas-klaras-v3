<template>
  <div class="h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex overflow-hidden">
    <AdminSidebar />
    
    <main class="flex-1 flex flex-col overflow-hidden">
      <AdminHeader title="Projects" subtitle="Manage and monitor all projects" />
      
      <div class="flex-1 overflow-y-auto p-8">
        <div class="mb-6 flex items-center justify-between">
          <div class="flex-1 max-w-md">
            <SearchInput
                v-model="searchQuery"
                placeholder="Search projects by name..."
              />
          </div>
          <Button @click="openAddModal" class="ml-4">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Project
          </Button>
        </div>

        <Table
          :columns="PROJECT_TABLE_COLUMNS"
          :data="filteredProjects"
          key-field="id"
          empty-message="No projects found"
          empty-description="Try adjusting your search criteria."
        >
          <template #cell-name="{ row }">
            <div class="text-sm font-medium text-gray-900">{{ row.name }}</div>
            <div class="text-xs text-gray-500 mt-1 line-clamp-2">{{ row.services }}</div>
          </template>

          <template #cell-implementingUnit="{ row }">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
              {{ row.implementingUnit }}
                    </span>
          </template>

          <template #cell-appropriation="{ row }">
            <div class="text-sm text-gray-900">₱{{ formatNumber(row.appropriation) }}</div>
          </template>

          <template #cell-year="{ row }">
            <div class="text-sm text-gray-900">{{ row.year }}</div>
          </template>

          <template #cell-duration="{ row }">
            <div class="text-sm text-gray-900">{{ formatDate(row.startDate) }} - {{ formatDate(row.endDate) }}</div>
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
          <div class="flex items-center space-x-2">
            <button class="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" disabled>
              Previous
            </button>
            <button class="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" disabled>
              Next
            </button>
          </div>
        </div>
      </div>
      
      <AdminFooter />
    </main>

    <ProjectsAddOrCreateProject
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
import { PROJECT_TABLE_COLUMNS } from '~/constants/project/tableColumns'
import { useProjects } from '~/composables/project/useProjects'
import { useProjectSearch } from '~/composables/project/useProjectSearch'
import { useProjectModal } from '~/composables/project/useProjectModal'
import { useProjectFormatting } from '~/composables/project/useProjectFormatting'

const searchQuery = ref('')

const { projects, saveError, handleSaveProject, handleDelete } = useProjects()
const { filteredProjects } = useProjectSearch(projects, searchQuery)
const { isModalOpen, editingProject, openAddModal, openEditModal, closeModal } = useProjectModal(saveError)
const { formatNumber, formatDate } = useProjectFormatting()

const onSaveProject = async (projectData: any) => {
  await handleSaveProject(projectData, editingProject.value)
    closeModal()
}
</script>

