<template>
  <div class="min-h-screen flex bg-brand-bg">
    <div class="w-full md:w-1/2 flex flex-col justify-center px-8 py-12 bg-white">
      <div class="max-w-md w-full mx-auto space-y-8">
        <h1 class="text-4xl font-extrabold text-brand-blue mb-2">Welcome to Kwentas Klaras</h1>
        <p class="text-brand-green mb-8">Hey, welcome back let's get you signed in</p>
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div class="space-y-2">
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
              placeholder="stanley@gmail.com"
              required
            />
            <p v-if="errors.email" class="text-sm text-red-600">{{ errors.email }}</p>
          </div>
          <div class="space-y-2">
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                placeholder="Password"
                required
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                @click="togglePasswordVisibility"
              >
                <svg v-if="showPassword" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                <svg v-else class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="text-sm text-red-600">{{ errors.password }}</p>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-brand-green focus:ring-brand-green border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-brand-blue">
                Remember me
              </label>
            </div>
            <div class="text-sm">
              <a href="#" class="font-medium text-brand-green hover:text-brand-blue">
                Forgot Password?
              </a>
            </div>
          </div>
          <div v-if="error" class="mt-4">
            <ErrorMessage :message="error" />
          </div>
          <div class="mt-6">
            <button
              type="submit"
              :disabled="loading"
              style="background-color: #2563EB;"
              class="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:[background-color:#22C98D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="flex items-center">
                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Signing in...
              </span>
              <span v-else>Sign In</span>
            </button>
          </div>
        </form>
        <div class="mt-8 text-center text-sm text-brand-green">
          Don't have an account?
          <a href="#" class="text-brand-blue font-medium hover:underline">Sign Up</a>
        </div>
      </div>
    </div>
    <div class="hidden md:flex w-1/2 relative overflow-hidden">
      <div class="absolute inset-0 bg-gray-300 opacity-60 z-0"></div>
      <div class="absolute inset-0 bg-brand-blue opacity-20 z-10"></div>
      <img src="https://images.unsplash.com/photo-1616763355603-9755a640a287?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" alt="Illustration" class="w-full h-full object-cover relative z-20" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLogin } from '~/composables/auth/useLogin'

definePageMeta({
  layout: false,
})

const { form, loading, error, showPassword, handleLogin, togglePasswordVisibility } = useLogin()

const errors = ref<{ email?: string; password?: string }>({})

const validateForm = (): boolean => {
  errors.value = {}
  
  if (!form.email) {
    errors.value.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.value.email = 'Email is invalid'
  }
  
  if (!form.password) {
    errors.value.password = 'Password is required'
  } else if (form.password.length < 8) {
    errors.value.password = 'Password must be at least 8 characters'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  await handleLogin()
}
</script>