<template>
  <div class="h-screen bg-brand-bg flex overflow-hidden">
    <AdminSidebar />
    
    <main class="flex-1 flex flex-col overflow-hidden">
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-brand-bg">
        <div class="space-y-6 min-h-full flex flex-col">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-1">All Projects</h1>
              <p class="text-sm text-gray-500">Manage and track all projects</p>
            </div>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                <button
                  @click="filterType = PROJECT_FILTER_TYPES.ALL"
                  :class="[
                    'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                    filterType === PROJECT_FILTER_TYPES.ALL
                      ? 'bg-white text-blue-600 shadow-sm'
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
                      ? 'bg-white text-blue-600 shadow-sm'
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
                      ? 'bg-white text-blue-600 shadow-sm'
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
              <button v-if="canManageProjects" @click="goToAddProject" class="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                Add Project
              </button>
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

            <div v-else class="space-y-3 flex-1">
              <div
                v-for="project in filteredProjects"
                :key="project.id"
                class="project-card bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-blue-300 transition-all duration-200"
              >
                <div class="flex items-center gap-6">
                  <div class="flex items-start gap-4 flex-1 min-w-0">
                    <div class="flex-shrink-0">
                      <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center gap-3 mb-2">
                        <h3 class="text-lg font-bold text-gray-900 truncate">{{ project.name }}</h3>
                        <span v-if="project.code" class="px-2 py-0.5 inline-flex text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                          {{ project.code }}
                        </span>
                      </div>
                      <div class="flex items-center gap-4 flex-wrap">
                        <span v-if="project.implementingUnit" class="inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                          {{ project.implementingUnit }}
                        </span>
                        <span v-if="project.location" class="text-sm text-gray-600">{{ project.location }}</span>
                        <span class="text-sm font-bold text-gray-900">₱{{ formatNumber(project.appropriation) }}</span>
                        <span v-if="project.totalAddedBudget && project.totalAddedBudget > 0" class="text-sm font-semibold text-green-600">
                          +₱{{ formatNumber(project.totalAddedBudget) }} added
                        </span>
                        <span class="text-xs text-gray-500">{{ project.year }}</span>
                        <span v-if="project.startDate || project.endDate" class="text-xs text-gray-500">
                          {{ formatDate(project.startDate) }} - {{ formatDate(project.endDate) }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 flex-shrink-0">
                    <button @click.stop="goToProject(project)" class="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                      View Project
                    </button>
                    <div v-if="project.id" class="relative" ref="dropdownRef">
                      <button
                        @click.stop="toggleDropdown(project.id)"
                        class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        :class="{ 'bg-gray-100': openDropdownId === project.id }"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                      <div
                        v-if="openDropdownId === project.id"
                        class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                        @click.stop
                      >
                        <button
                          @click.stop="openAddBudgetModal(project)"
                          class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Add Additional Budget
                        </button>
                        <button
                          @click.stop="openAddObligationModal(project)"
                          class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Add Obligation
                        </button>
                        <button
                          @click.stop="openAddDisbursementModal(project)"
                          class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Add Disbursement
                        </button>
                        <button
                          @click.stop="goToProject(project)"
                          class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="filteredProjects.length > 0" class="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
              <div class="text-sm text-gray-600">
                Showing <span class="font-bold text-gray-900">{{ filteredProjects.length }}</span> of <span class="font-bold text-gray-900">{{ projects.length }}</span> projects
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>

    <div v-if="saveError" class="fixed top-4 right-4 z-[10000]">
      <ErrorMessage :message="saveError" />
    </div>

    <div v-if="budgetSaveError" class="fixed top-4 right-4 z-[10000]" style="margin-top: 80px;">
      <ErrorMessage :message="budgetSaveError" />
    </div>

    <div v-if="obligationSaveError" class="fixed top-4 right-4 z-[10000]" style="margin-top: 160px;">
      <ErrorMessage :message="obligationSaveError" />
    </div>

    <div v-if="disbursementSaveError" class="fixed top-4 right-4 z-[10000]" style="margin-top: 240px;">
      <ErrorMessage :message="disbursementSaveError" />
    </div>

    <AddAdditionalBudget
      :is-open="isBudgetModalOpen"
      :project-id="selectedProjectId"
      @close="closeBudgetModal"
      @save="handleSaveBudget"
    />

    <AddObligation
      :is-open="isObligationModalOpen"
      :project-id="selectedProjectId"
      @close="closeObligationModal"
      @save="handleSaveObligation"
    />

    <AddDisbursement
      :is-open="isDisbursementModalOpen"
      :project-id="selectedProjectId"
      @close="closeDisbursementModal"
      @save="handleSaveDisbursement"
    />
  </div>
</template>

<script setup lang="ts">
import StatCard from '~/components/ui/StatCard.vue'
import SearchInput from '~/components/ui/SearchInput.vue'
import ErrorMessage from '~/components/ui/ErrorMessage.vue'
import AddAdditionalBudget from '~/components/projects/AddAdditionalBudget.vue'
import AddObligation from '~/components/projects/AddObligation.vue'
import AddDisbursement from '~/components/projects/AddDisbursement.vue'
import { useProjects } from '~/composables/project/useProjects'
import { useProjectSearch } from '~/composables/project/useProjectSearch'
import { useProjectFormatting } from '~/composables/project/useProjectFormatting'
import { useAdditionalBudgets } from '~/composables/additionalBudget/useAdditionalBudgets'
import { useObligations } from '~/composables/obligation/useObligations'
import { useDisbursements } from '~/composables/disbursement/useDisbursements'
import { PROJECT_FILTER_TYPES, type ProjectFilterType } from '~/constants/project/filterTypes'
import { getIconBgColor } from '~/constants/ui/statColors'
import { useUserPermissions } from '~/composables/user/useUserPermissions'

const searchQuery = ref('')
const filterType = ref<ProjectFilterType>(PROJECT_FILTER_TYPES.ALL)
const openDropdownId = ref<string | null>(null)
const isBudgetModalOpen = ref(false)
const isObligationModalOpen = ref(false)
const isDisbursementModalOpen = ref(false)
const selectedProjectId = ref('')

const { projects, saveError, fetchProjects, projectStats } = useProjects()
const { canManageProjects } = useUserPermissions()
const { createBudget, saveError: budgetSaveError } = useAdditionalBudgets()
const { createObligation, saveError: obligationSaveError } = useObligations()
const { createDisbursement, saveError: disbursementSaveError } = useDisbursements()

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
  closeDropdown(project.id)
  router.push(`/admin/projects/${project.id}`)
}

const goToAddProject = () => {
  router.push('/admin/projects/add')
}

const toggleDropdown = (projectId: string) => {
  openDropdownId.value = openDropdownId.value === projectId ? null : projectId
}

const closeDropdown = (projectId: string) => {
  if (openDropdownId.value === projectId) {
    openDropdownId.value = null
  }
}

const openAddBudgetModal = (project: any) => {
  selectedProjectId.value = project.id
  isBudgetModalOpen.value = true
  openDropdownId.value = null
}

const closeBudgetModal = () => {
  isBudgetModalOpen.value = false
  selectedProjectId.value = ''
}

const openAddObligationModal = (project: any) => {
  selectedProjectId.value = project.id
  isObligationModalOpen.value = true
  openDropdownId.value = null
}

const closeObligationModal = () => {
  isObligationModalOpen.value = false
  selectedProjectId.value = ''
}

const openAddDisbursementModal = (project: any) => {
  selectedProjectId.value = project.id
  isDisbursementModalOpen.value = true
  openDropdownId.value = null
}

const closeDisbursementModal = () => {
  isDisbursementModalOpen.value = false
  selectedProjectId.value = ''
}

const handleSaveBudget = async (budgetData: {
  projectId: string
  amount: number
  reason: string
  approvedBy?: string
  approvedDate?: string
  status?: string
}) => {
  try {
    await createBudget({
      projectId: budgetData.projectId,
      amount: budgetData.amount,
      reason: budgetData.reason,
      approvedBy: budgetData.approvedBy,
      approvedDate: budgetData.approvedDate ? new Date(budgetData.approvedDate) : undefined,
      status: budgetData.status as 'pending' | 'approved' | 'rejected' | undefined,
    })
    closeBudgetModal()
    // Refresh projects to update total added budget
    await fetchProjects()
  } catch (error) {
    // Error is handled by the composable
    console.error('Failed to save budget:', error)
  }
}

const handleSaveObligation = async (obligationData: {
  projectId: string
  amount: number
  reason: string
  payee: string
  approvedBy?: string
  approvedDate?: string
  status?: string
}) => {
  try {
    await createObligation({
      projectId: obligationData.projectId,
      amount: obligationData.amount,
      reason: obligationData.reason,
      payee: obligationData.payee,
      approvedBy: obligationData.approvedBy,
      approvedDate: obligationData.approvedDate ? new Date(obligationData.approvedDate) : undefined,
      status: obligationData.status as 'pending' | 'approved' | 'rejected' | undefined,
    })
    closeObligationModal()
    // Refresh projects to update any obligation-related data
    await fetchProjects()
  } catch (error) {
    // Error is handled by the composable
    console.error('Failed to save obligation:', error)
  }
}

const handleSaveDisbursement = async (disbursementData: {
  projectId: string
  amount: number
  reason: string
  payee: string
  approvedBy?: string
  approvedDate?: string
}) => {
  try {
    await createDisbursement({
      projectId: disbursementData.projectId,
      amount: disbursementData.amount,
      reason: disbursementData.reason,
      payee: disbursementData.payee,
      approvedBy: disbursementData.approvedBy,
      approvedDate: disbursementData.approvedDate ? new Date(disbursementData.approvedDate) : undefined,
    })
    closeDisbursementModal()
    // Refresh projects to update any disbursement-related data
    await fetchProjects()
  } catch (error) {
    // Error is handled by the composable
    console.error('Failed to save disbursement:', error)
  }
}

// Close dropdown when clicking outside
onMounted(() => {
  const handleClickOutside = () => {
    if (openDropdownId.value) {
      openDropdownId.value = null
    }
  }
  document.addEventListener('click', handleClickOutside)
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>
