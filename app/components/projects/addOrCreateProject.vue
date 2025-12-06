<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[9999] overflow-y-auto" @click.self="closeModal">
        <div class="fixed inset-0 backdrop-blur-md" @click="closeModal" style="background-color: rgba(0, 0, 0, 0.1); transition: none;"></div>

        <div class="flex min-h-full items-center justify-center p-4">
          <div class="relative bg-white rounded-lg shadow-xl w-full max-w-4xl animate-fade-in" @click.stop>
            <div class="px-6 pt-6 pb-4">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-semibold leading-6 text-gray-900">
                  {{ editingProject ? 'Edit Project' : 'Add New Project' }}
                </h3>
                <button @click="closeModal" class="text-gray-400 hover:text-gray-500 transition cursor-pointer">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="md:col-span-2">
                <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                  Project Name
                </label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  required
                  class="block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <label for="implementingUnit" class="block text-sm font-medium text-gray-700 mb-2">
                  Implementing Unit
                </label>
                <select
                  id="implementingUnit"
                  v-model="form.implementingUnit"
                  required
                  class="block w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select implementing unit</option>
                  <option v-for="dept in USER_DEPARTMENTS" :key="dept" :value="dept">
                    {{ dept }}
                  </option>
                </select>
              </div>

              <div>
                <label for="year" class="block text-sm font-medium text-gray-700 mb-2">
                  Year
                </label>
                <input
                  id="year"
                  v-model.number="form.year"
                  type="number"
                  required
                  min="2000"
                  max="2100"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter year"
                />
              </div>

              <div>
                <label for="appropriation" class="block text-sm font-medium text-gray-700 mb-2">
                  Appropriation
                </label>
                <input
                  id="appropriation"
                  v-model.number="form.appropriation"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter appropriation amount"
                />
              </div>

              <div>
                <label for="startDate" class="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  id="startDate"
                  v-model="form.startDate"
                  type="date"
                  required
                  class="block w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label for="endDate" class="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  id="endDate"
                  v-model="form.endDate"
                  type="date"
                  required
                  :min="form.startDate"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label for="services" class="block text-sm font-medium text-gray-700 mb-2">
                  Services
                </label>
                <select
                  id="services"
                  v-model="form.services"
                  required
                  class="block w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select a service</option>
                  <option v-for="service in USER_SERVICES" :key="service" :value="service">
                    {{ service }}
                  </option>
                </select>
              </div>
            </div>

            <div v-if="error" class="rounded-lg bg-red-50 border border-red-200 p-3">
              <p class="text-sm text-red-800">{{ error }}</p>
            </div>

            <div class="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <span v-if="!loading">{{ editingProject ? 'Update Project' : 'Create Project' }}</span>
                <span v-else class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              </button>
              </div>
              </form>
            </div>
          </div>
        </div>
      </div>
  </Teleport>
</template>

<script setup lang="ts">
import { USER_DEPARTMENTS } from '~/constants/user/userDepartments'
import { USER_SERVICES } from '~/constants/user/userServices'
import type { UserDepartment } from '~/types/user/userDepartment'
import type { UserService } from '~/types/user/userServices'

interface Project {
  id?: string
  name: string
  implementingUnit: string
  appropriation: number
  startDate: string | Date
  endDate: string | Date
  year: number
  services: string
}

interface Props {
  isOpen: boolean
  editingProject?: Project | null
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  editingProject: null
})

const emit = defineEmits<{
  close: []
  save: [project: Project]
}>()

const form = ref({
  name: '',
  implementingUnit: '',
  appropriation: 0,
  startDate: '',
  endDate: '',
  year: new Date().getFullYear(),
  services: '' as UserService | ''
})

const error = ref('')
const loading = ref(false)

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (props.editingProject) {
      const project = props.editingProject
      const startDateStr = typeof project.startDate === 'string' 
        ? project.startDate.split('T')[0] 
        : new Date(project.startDate).toISOString().split('T')[0]
      const endDateStr = typeof project.endDate === 'string' 
        ? project.endDate.split('T')[0] 
        : new Date(project.endDate).toISOString().split('T')[0]
      
      form.value = {
        name: project.name,
        implementingUnit: project.implementingUnit,
        appropriation: project.appropriation,
        startDate: startDateStr || '',
        endDate: endDateStr || '',
        year: project.year,
        services: project.services as UserService | ''
      }
    } else {
      resetForm()
    }
    error.value = ''
  }
})

watch(() => props.editingProject, (newVal) => {
  if (newVal && props.isOpen) {
    const project = newVal
    const startDateStr = typeof project.startDate === 'string' 
      ? project.startDate.split('T')[0] 
      : new Date(project.startDate).toISOString().split('T')[0]
    const endDateStr = typeof project.endDate === 'string' 
      ? project.endDate.split('T')[0] 
      : new Date(project.endDate).toISOString().split('T')[0]
    
    form.value = {
      name: project.name,
      implementingUnit: project.implementingUnit,
      appropriation: project.appropriation,
      startDate: startDateStr || '',
      endDate: endDateStr || '',
      year: project.year,
      services: project.services as UserService | ''
    }
  } else if (!newVal && props.isOpen) {
    resetForm()
  }
})

const resetForm = () => {
  form.value = {
    name: '',
    implementingUnit: '',
    appropriation: 0,
    startDate: '',
    endDate: '',
    year: new Date().getFullYear(),
    services: '' as UserService | ''
  }
  error.value = ''
}

const closeModal = () => {
  resetForm()
  emit('close')
}

const handleSubmit = async () => {
  error.value = ''
  loading.value = true

  try {
    if (!form.value.name.trim()) {
      error.value = 'Project name is required'
      loading.value = false
      return
    }

    if (!form.value.implementingUnit) {
      error.value = 'Implementing unit is required'
      loading.value = false
      return
    }

    if (!form.value.appropriation || form.value.appropriation <= 0) {
      error.value = 'Appropriation must be greater than 0'
      loading.value = false
      return
    }

    if (!form.value.startDate) {
      error.value = 'Start date is required'
      loading.value = false
      return
    }

    if (!form.value.endDate) {
      error.value = 'End date is required'
      loading.value = false
      return
    }

    if (new Date(form.value.endDate) < new Date(form.value.startDate)) {
      error.value = 'End date must be after or equal to start date'
      loading.value = false
      return
    }

    if (!form.value.year || form.value.year < 2000 || form.value.year > 2100) {
      error.value = 'Year must be between 2000 and 2100'
      loading.value = false
      return
    }

    if (!form.value.services) {
      error.value = 'Services is required'
      loading.value = false
      return
    }

    const projectData: Project = {
      ...(props.editingProject?.id && { id: props.editingProject.id }),
      name: form.value.name.trim(),
      implementingUnit: form.value.implementingUnit,
      appropriation: form.value.appropriation,
      startDate: new Date(form.value.startDate),
      endDate: new Date(form.value.endDate),
      year: form.value.year,
      services: form.value.services
    }

    emit('save', projectData)
    closeModal()
  } catch (err: any) {
    error.value = err?.message || 'An error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}
</style>

