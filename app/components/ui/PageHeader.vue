<template>
  <section class="relative overflow-hidden rounded-2xl border border-gray-300 p-0 mb-4 animate-fade-in">
    <div class="absolute inset-0 bg-white"></div>
    <div class="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-0 items-stretch">
      <div class="col-span-2 flex flex-col justify-center px-4 lg:px-5 py-3 lg:py-4 md:py-5">
        <h1 class="text-lg lg:text-xl md:text-2xl font-extrabold text-brand-blue mb-1.5 lg:mb-2 tracking-tight text-left">
          {{ title }}
        </h1>
        <p class="text-xs text-brand-green mb-3 lg:mb-3.5 max-w-2xl font-normal leading-relaxed text-left">
          {{ description }}
        </p>
        <button
          v-if="buttonText && buttonAction"
          type="button"
          @click="handleButtonClick"
          style="background-color: #2563EB;"
          class="mt-1.5 flex items-center justify-center gap-2 py-2 px-3.5 border border-transparent rounded-lg shadow-sm text-xs font-medium text-white hover:[background-color:#22C98D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 w-fit"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>{{ buttonText }}</span>
        </button>
      </div>
      <div v-if="stats && stats.length > 0" class="flex flex-col gap-0 justify-center px-4 py-3 md:py-4 bg-white border-l border-gray-300 rounded-2xl md:rounded-l-none md:rounded-r-2xl">
        <div class="flex flex-col gap-0 divide-y divide-gray-300">
          <div v-for="(stat, index) in stats.slice(0, 2)" :key="index" class="flex items-center gap-3 py-3">
            <div class="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-300 shadow-sm">
              <slot :name="`icon-${index}`" :stat="stat" :index="index">
                <svg v-if="index === 0" :class="`w-4 h-4 ${getStatIconColor(stat.color)}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <svg v-else :class="`w-4 h-4 ${getStatIconColor(stat.color)}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </slot>
            </div>
            <div>
              <div class="text-lg font-bold text-brand-blue flex items-center gap-2">
                {{ stat.value }}
              </div>
              <div class="flex items-center gap-1 mt-0.5">
                <span :class="['text-xs font-semibold', stat.changeType === 'positive' ? 'text-brand-green' : stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-400']">
                  <span v-if="stat.changeType === 'positive'">▲</span>
                  <span v-else-if="stat.changeType === 'negative'">▼</span>
                  <span v-else>-</span>
                  {{ stat.change }}
                </span>
              </div>
              <div class="text-gray-400 text-xs font-medium">{{ stat.title }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { PageHeaderProps } from '~/types/ui/pageHeader'
import { getStatIconColor } from '~/constants/ui/statColors'

const props = defineProps<PageHeaderProps>()

const handleButtonClick = async (event: MouseEvent) => {
  event.preventDefault()
  event.stopPropagation()
  if (props.buttonAction) {
    await props.buttonAction()
  }
}
</script>

