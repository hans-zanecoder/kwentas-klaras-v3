<template>
  <div class="min-h-screen flex">
    <ImageCarousel :images="carouselImages" />

    <div class="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <h2 class="text-4xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p class="text-sm text-gray-600">
            Sign in to your account to continue
          </p>
        </div>

        <div class="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
        <form @submit.prevent="handleLogin" class="space-y-6">
            <TextInput
              id="email"
              v-model="form.email"
              type="email"
              label="Email Address"
              placeholder="Enter your email"
              required
              autocomplete="email"
            >
              <template #icon>
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </template>
            </TextInput>

            <PasswordInput
                id="password"
                v-model="form.password"
              label="Password"
              placeholder="Enter your password"
                required
                autocomplete="current-password"
            />

            <ErrorMessage :message="error" />

            <SubmitButton
              :loading="loading"
              text="Sign in"
              loading-text="Signing in..."
            />
        </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CarouselImage } from '~/types/ui/imageCarousel'
import { useLogin } from '~/composables/auth/useLogin'

definePageMeta({
  layout: false,
})

const carouselImages: CarouselImage[] = [
  {
    src: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=1200&h=800&fit=crop',
    alt: 'Beautiful landscape',
    title: 'Welcome to Your Workspace',
    description: 'Experience a seamless and intuitive platform designed to help you achieve your goals.',
  },
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
    alt: 'Mountain view',
    title: 'Secure & Reliable',
    description: 'Your data is protected with enterprise-grade security and encryption.',
  },
  {
    src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&h=800&fit=crop',
    alt: 'Nature scene',
    title: 'Stay Productive',
    description: 'Access all your tools and resources in one place, anytime, anywhere.',
  },
  {
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
    alt: 'Forest path',
    title: 'Collaborate Effortlessly',
    description: 'Work together with your team and share ideas in real-time.',
  },
]

const { form, loading, error, handleLogin } = useLogin()
</script>