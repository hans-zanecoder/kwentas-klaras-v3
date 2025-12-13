<template>
  <div class="h-screen bg-brand-bg flex overflow-hidden">
    <AdminSidebar />
    
    <main class="flex-1 flex flex-col overflow-hidden">
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-brand-bg">
        <div class="max-w-6xl mx-auto">
          <div class="mb-6">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h1 class="text-2xl font-extrabold text-brand-blue mb-2">Add New Project</h1>
                <p class="text-sm text-brand-green">Fill in the project details below</p>
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
                @click="navigateTo('/admin/projects')"
                class="text-brand-blue hover:text-brand-green"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Projects</span>
              </Button>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-300 p-6 lg:p-8">
            <form @submit.prevent="handleSubmit" class="space-y-8">
              <div class="space-y-6">
                <h2 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Project Information
                </h2>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                      Project Name <span class="text-red-500">*</span>
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

                  <div>
                    <label for="implementingUnit" class="block text-sm font-medium text-gray-700 mb-2">
                      Implementing Unit <span class="text-red-500">*</span>
                    </label>
                    <select
                      id="implementingUnit"
                      v-model="form.implementingUnit"
                      required
                      class="block w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                    >
                      <option value="">Select implementing unit</option>
                      <option v-for="dept in USER_DEPARTMENTS" :key="dept" :value="dept">
                        {{ dept }}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label for="year" class="block text-sm font-medium text-gray-700 mb-2">
                      Year <span class="text-red-500">*</span>
                    </label>
                    <input
                      id="year"
                      v-model.number="form.year"
                      type="number"
                      required
                      min="2000"
                      max="2100"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                      placeholder="Enter year"
                    />
                  </div>

                  <div>
                    <label for="appropriation" class="block text-sm font-medium text-gray-700 mb-2">
                      Appropriation <span class="text-red-500">*</span>
                    </label>
                    <input
                      id="appropriation"
                      v-model.number="form.appropriation"
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                      placeholder="Enter appropriation amount"
                    />
                  </div>
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
                
                <div>
                  <label for="services" class="block text-sm font-medium text-gray-700 mb-2">
                    Services <span class="text-red-500">*</span>
                  </label>
                  <select
                    id="services"
                    v-model="form.services"
                    required
                    class="block w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                  >
                    <option value="">Select a service</option>
                    <option v-for="service in services" :key="service.id" :value="service.name">
                      {{ service.name }}
                    </option>
                  </select>
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
                  @click="navigateTo('/admin/projects')"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  :loading="loading"
                  :disabled="loading"
                >
                  <template #loading>Creating...</template>
                  Create Project
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Button from '~/components/ui/Button.vue'
import ErrorMessage from '~/components/ui/ErrorMessage.vue'
import { USER_DEPARTMENTS } from '~/constants/user/userDepartments'
import { useProjectForm } from '~/composables/project/useProjectForm'
import { useServices } from '~/composables/service/useServices'

const { form, loading, error, requiredFieldsCount, remainingRequiredFields, handleSubmit } = useProjectForm()
const { services, fetchServices } = useServices()

onMounted(async () => {
  await fetchServices()
})
</script>

