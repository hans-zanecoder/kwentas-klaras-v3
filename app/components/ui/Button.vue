<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses.classes"
    :style="buttonClasses.primaryStyle"
  >
    <span v-if="loading" class="flex items-center">
      <svg
        class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <slot name="loading">Loading...</slot>
    </span>
    <span v-else class="flex items-center">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import type { ButtonProps } from '~/types/ui/button'
import { useButton } from '~/composables/ui/useButton'

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
})

const { buttonClasses } = useButton(props)
</script>

