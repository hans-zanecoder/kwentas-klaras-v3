<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
  >
    <slot />
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

