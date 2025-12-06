<template>
  <div class="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 overflow-hidden">
    <div class="absolute inset-0">
      <div
        v-for="(image, index) in images"
        :key="index"
        class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
        :class="{ 'opacity-100 z-10': currentImageIndex === index, 'opacity-0 z-0': currentImageIndex !== index }"
      >
        <NuxtImg
          :src="image.src"
          :alt="image.alt"
          class="w-full h-full object-cover"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
      </div>
    </div>

    <div class="relative z-20 flex flex-col justify-end p-12 text-white">
      <div class="max-w-md mb-16">
        <h2 class="text-4xl font-bold mb-4 drop-shadow-lg">
          {{ images[currentImageIndex]?.title || '' }}
        </h2>
        <p class="text-lg text-white/90 drop-shadow-md">
          {{ images[currentImageIndex]?.description || '' }}
        </p>
      </div>
    </div>

    <div class="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
      <button
        v-for="(image, index) in images"
        :key="index"
        @click="goToImage(index)"
        class="h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
        :class="currentImageIndex === index ? 'w-8 bg-white shadow-lg' : 'w-2 bg-white/50 hover:bg-white/75'"
        :aria-label="`Go to slide ${index + 1}`"
      />
    </div>

    <button
      @click="previousImage"
      class="absolute left-6 top-1/2 transform -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
      aria-label="Previous image"
    >
      <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <button
      @click="nextImage"
      class="absolute right-6 top-1/2 transform -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
      aria-label="Next image"
    >
      <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { ImageCarouselProps } from '~/types/ui/imageCarousel'
import { useCarousel } from '~/composables/ui/useCarousel'

const props = withDefaults(defineProps<ImageCarouselProps>(), {
  intervalMs: 5000,
})

const { currentImageIndex, nextImage, previousImage, goToImage } = useCarousel(props.images, props.intervalMs)
</script>

