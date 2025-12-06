<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[9999] overflow-y-auto" @click.self="closeModal">
        <div class="fixed inset-0 backdrop-blur-md" @click="closeModal" style="background-color: rgba(0, 0, 0, 0.1); transition: none;"></div>

        <div class="flex min-h-full items-center justify-center p-4">
          <div class="relative bg-white rounded-lg shadow-xl w-full max-w-4xl animate-fade-in" @click.stop>
            <div class="px-6 pt-6 pb-4">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-semibold leading-6 text-gray-900">
                  {{ editingUser ? 'Edit User' : 'Add New User' }}
                </h3>
                <button @click="closeModal" class="text-gray-400 hover:text-gray-500 transition cursor-pointer">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  v-model="form.firstName"
                  type="text"
                  required
                  class="block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter first name"
                />
              </div>

              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  v-model="form.lastName"
                  type="text"
                  required
                  class="block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter last name"
                />
              </div>

              <div>
                <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  v-model="form.username"
                  type="text"
                  required
                  class="block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  class="block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label for="department" class="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  id="department"
                  v-model="form.department"
                  required
                  class="block w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select a department</option>
                  <option v-for="dept in USER_DEPARTMENTS" :key="dept" :value="dept">
                    {{ dept }}
                  </option>
                </select>
              </div>

              <div v-if="!editingUser">
                <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div class="relative">
                  <input
                    id="password"
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    :required="!editingUser"
                    class="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>


            </div>

            <div v-if="error" class="rounded-lg bg-red-50 border border-red-200 p-3">
              <p class="text-sm text-red-800">{{ error }}</p>
            </div>

            <div class="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="!loading">{{ editingUser ? 'Update User' : 'Create User' }}</span>
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
import type { UserDepartment } from '~/types/user/userDepartment'
import type { User } from '../../types/user/user'

interface UserWithPassword extends User {
  password?: string
}

interface Props {
  isOpen: boolean
  editingUser?: UserWithPassword | null
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  editingUser: null
})

const emit = defineEmits<{
  close: []
  save: [user: UserWithPassword]
}>()

const form = ref({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  department: '',
  status: 'Active',
  password: ''
})

const error = ref('')
const loading = ref(false)
const showPassword = ref(false)

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (props.editingUser) {
      form.value = {
        firstName: props.editingUser.firstName,
        lastName: props.editingUser.lastName,
        username: props.editingUser.username,
        email: props.editingUser.email,
        department: props.editingUser.department,
        status: props.editingUser.status,
        password: ''
      }
    } else {
      resetForm()
    }
    error.value = ''
  }
})

watch(() => props.editingUser, (newVal) => {
  if (newVal && props.isOpen) {
    form.value = {
      firstName: newVal.firstName,
      lastName: newVal.lastName,
      username: newVal.username,
      email: newVal.email,
      department: newVal.department,
      status: newVal.status,
      password: ''
    }
  } else if (!newVal && props.isOpen) {
    resetForm()
  }
})

const resetForm = () => {
  form.value = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    department: '',
    status: 'Active',
    password: ''
  }
  error.value = ''
  showPassword.value = false
}

const closeModal = () => {
  resetForm()
  emit('close')
}

const handleSubmit = async () => {
  error.value = ''
  loading.value = true

  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.value.email)) {
      error.value = 'Please enter a valid email address'
      loading.value = false
      return
    }

    if (!props.editingUser && !form.value.password) {
      error.value = 'Password is required for new users'
      loading.value = false
      return
    }

    const userData: UserWithPassword = {
      ...(props.editingUser?.id && { id: props.editingUser.id }),
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      username: form.value.username.startsWith('@') ? form.value.username : `@${form.value.username}`,
      email: form.value.email,
      department: form.value.department,
      status: form.value.status as 'Active' | 'Inactive',
      ...(!props.editingUser && { password: form.value.password })
    }

    emit('save', userData)
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


