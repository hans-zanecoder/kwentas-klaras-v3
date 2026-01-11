<template>
  <div class="h-screen bg-brand-bg flex overflow-hidden">
    <AdminSidebar />
    
    <main class="flex-1 flex flex-col overflow-hidden">
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-brand-bg">
        <div class="max-w-6xl mx-auto">
          <div class="mb-6">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h1 class="text-2xl font-extrabold text-brand-blue mb-2">Edit Project</h1>
                <p class="text-sm text-brand-green">Update the project details below</p>
                <div class="mt-2 text-xs text-gray-500">
                  <span class="font-medium">{{ requiredFieldsCount }}</span> required fields
                  <span v-if="remainingRequiredFields > 0" class="ml-2 text-orange-600 font-medium">
                    • {{ remainingRequiredFields }} left to complete
                  </span>
                  <span v-else class="ml-2 text-green-600 font-medium">
                    • All fields completed
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                @click="navigateTo(`/admin/projects/${projectId}`)"
                class="text-brand-blue hover:text-brand-green"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Project</span>
              </Button>
            </div>
          </div>

          <div v-if="loading && !form.name" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
            <p class="mt-4 text-gray-600">Loading project details...</p>
          </div>

          <div v-else class="bg-white rounded-xl shadow-sm border border-gray-300 p-6 lg:p-8">
            <form @submit.prevent="handleSubmit" class="space-y-8">
              <div class="space-y-6">
                <h2 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Project Information
                </h2>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                      PPA (Programs, Projects, Activities) <span class="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      v-model="form.name"
                      type="text"
                      required
                      class="block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                      placeholder="Enter project name"
                    />
                  </div>

                  <SelectInput
                    id="implementingUnit"
                    v-model="form.implementingUnit"
                    :options="departments"
                    placeholder="Select implementing unit"
                    label="Implementing Unit"
                    required
                  />

                  <SelectInput
                    id="location"
                    v-model="form.location"
                    :options="locations"
                    placeholder="Select location"
                    label="Location"
                    required
                  />

                  <CurrencyInput
                    id="appropriation"
                    v-model="form.appropriation"
                    label="Appropriation"
                    placeholder="Enter appropriation amount"
                    required
                    currency="PHP"
                    :precision="2"
                    :min="0"
                  />
                </div>
              </div>

              <div class="space-y-6">
                <h2 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Project Timeline
                </h2>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label for="startDate" class="block text-sm font-medium text-gray-700 mb-2">
                      Start Date <span class="text-red-500">*</span>
                    </label>
                    <input
                      id="startDate"
                      v-model="form.startDate"
                      type="date"
                      required
                      class="block w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                    />
                  </div>

                  <div>
                    <label for="endDate" class="block text-sm font-medium text-gray-700 mb-2">
                      End Date <span class="text-red-500">*</span>
                    </label>
                    <input
                      id="endDate"
                      v-model="form.endDate"
                      type="date"
                      required
                      class="block w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                    />
                  </div>
                </div>
              </div>

              <div class="space-y-6">
                <h2 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Project Details
                </h2>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SelectInput
                    id="remarks"
                    v-model="form.remarks"
                    :options="remarks"
                    placeholder="Select remarks"
                    label="Remarks"
                    required
                  />

                  <div>
                    <label for="code" class="block text-sm font-medium text-gray-700 mb-2">
                      Code <span class="text-red-500">*</span>
                    </label>
                    <input
                      id="code"
                      v-model="form.code"
                      type="text"
                      required
                      class="block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                      placeholder="Enter project code"
                    />
                  </div>

                  <SelectInput
                    id="services"
                    v-model="form.services"
                    :options="services"
                    placeholder="Select a service"
                    label="Services"
                    required
                  />

                  <YearPicker
                    id="year"
                    v-model="form.year"
                    label="Year"
                    placeholder="Select year"
                    required
                    :min-year="1900"
                    :max-year="2100"
                  />
                </div>
              </div>

              <div v-if="error" class="mt-4">
                <ErrorMessage :message="error" />
              </div>

              <div class="flex items-center justify-end space-x-4 pt-4">
                <Button
                  variant="secondary"
                  size="md"
                  type="button"
                  @click="navigateTo(`/admin/projects/${projectId}`)"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  type="button"
                  @click="handleUpdateClick"
                  :loading="loading"
                  :disabled="loading || !isFormValid"
                >
                  <template #loading>{{ MODAL_MESSAGES.UPDATE_PROJECT.loadingText }}</template>
                  Update Project
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>

    <ConfirmModal
      :is-open="showConfirmationModal"
      :title="MODAL_MESSAGES.UPDATE_PROJECT.title"
      :message="MODAL_MESSAGES.UPDATE_PROJECT.message"
      :confirm-text="MODAL_MESSAGES.UPDATE_PROJECT.confirmText"
      :cancel-text="MODAL_MESSAGES.UPDATE_PROJECT.cancelText"
      :loading="false"
      :project-details="{
        name: form.name,
        appropriation: form.appropriation
      }"
      @confirm="onConfirmUpdate"
      @cancel="closeConfirmModal"
    />

    <LoadingModal
      :show="showLoadingModal"
      title="Updating Project"
      message="Please wait while we update the project..."
      :duration="2000"
    />

    <SuccessModal
      :show="showSuccessModal"
      title="Project Updated Successfully"
      :message="`${form.name || 'Project'} has been updated successfully.`"
      button-text="Close"
      :auto-close-seconds="3"
      count-down-message="Closing in"
      @close="handleSuccessClose"
    />
  </div>
</template>

<script setup lang="ts">
import Button from '~/components/ui/Button.vue'
import ErrorMessage from '~/components/ui/ErrorMessage.vue'
import SelectInput from '~/components/ui/SelectInput.vue'
import CurrencyInput from '~/components/ui/CurrencyInput.vue'
import YearPicker from '~/components/ui/YearPicker.vue'
import ConfirmModal from '~/components/ui/ConfirmModal.vue'
import SuccessModal from '~/components/ui/SuccessModal.vue'
import LoadingModal from '~/components/ui/LoadingModal.vue'
import { MODAL_MESSAGES } from '~/constants/ui/modalMessages'
import { useFormModals } from '~/composables/ui/useFormModals'
import { useProjectEditForm } from '~/composables/project/useProjectEditForm'
import { useServices } from '~/composables/service/useServices'
import { useDepartments } from '~/composables/department/useDepartments'
import { useLocations } from '~/composables/location/useLocations'
import { useRemarks } from '~/composables/remark/useRemarks'

const route = useRoute()
const projectId = route.params.id as string

const { form, loading, error, requiredFieldsCount, remainingRequiredFields, loadProject, handleSubmit } = useProjectEditForm(projectId)
const { services, fetchServices } = useServices()
const { departments, fetchDepartments } = useDepartments()
const { locations, fetchLocations } = useLocations()
const { remarks, fetchRemarks } = useRemarks()

const {
  showConfirmationModal,
  showLoadingModal,
  showSuccessModal,
  openConfirmModal,
  closeConfirmModal,
  startSubmission,
  closeSuccessModal,
} = useFormModals()

const isFormValid = computed(() => {
  const isValid = remainingRequiredFields.value === 0
  return isValid
})

const handleUpdateClick = () => {
  if (isFormValid.value) {
    openConfirmModal()
  }
}

const onConfirmUpdate = async () => {
  await startSubmission(handleSubmit)
}

const handleSuccessClose = () => {
  closeSuccessModal()
  navigateTo(`/admin/projects/${projectId}`)
}

onMounted(async () => {
  await Promise.all([
    fetchServices(),
    fetchDepartments(),
    fetchLocations(),
    fetchRemarks(),
    loadProject()
  ])
})
</script>

