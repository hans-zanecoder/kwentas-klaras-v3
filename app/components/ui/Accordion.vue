<template>
  <h2 :id="`accordion-heading-${id}`" :class="{ 'mt-4': !isFirst }">
    <button
      type="button"
      @click="toggle"
      class="flex items-center justify-between w-full p-5 font-medium text-gray-700 rounded-lg shadow-sm border border-gray-200 hover:text-gray-900 hover:bg-gray-50 gap-3 transition-colors"
      :class="[
        isOpen ? 'rounded-b-none shadow-none' : '',
      ]"
      :aria-expanded="isOpen"
      :aria-controls="`accordion-body-${id}`"
    >
      <span>{{ title }}</span>
      <svg
        class="w-5 h-5 shrink-0 transition-transform"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5 15 7-7 7 7" />
      </svg>
    </button>
  </h2>
  <div
    :id="`accordion-body-${id}`"
    class="border border-t-0 border-gray-200 rounded-b-lg shadow-sm"
    :class="{ 'hidden': !isOpen }"
    :aria-labelledby="`accordion-heading-${id}`"
  >
    <div class="p-4 md:p-5">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface AccordionProps {
  title: string
  defaultOpen?: boolean
  id?: string
  isFirst?: boolean
}

const props = withDefaults(defineProps<AccordionProps>(), {
  defaultOpen: false,
  id: () => Math.random().toString(36).substring(2, 9),
  isFirst: false,
})

const isOpen = ref(props.defaultOpen)

const toggle = () => {
  isOpen.value = !isOpen.value
}
</script>

