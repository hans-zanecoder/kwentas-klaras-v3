<template>
  <div>
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
    </label>
    <div class="relative">
      <div v-if="$slots.icon" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <slot name="icon" />
      </div>
      <input
        :id="id"
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :required="required"
        :autocomplete="autocomplete"
        :class="inputClasses"
        @input="handleInput"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TextInputProps, TextInputEmits } from '~/types/ui/textInput'
import { useTextInput } from '~/composables/ui/useTextInput'

const props = withDefaults(defineProps<TextInputProps>(), {
  type: 'text',
  placeholder: '',
  required: false,
  autocomplete: undefined,
  label: undefined,
  icon: undefined,
})

const emit = defineEmits<TextInputEmits>()

const { updateValue } = useTextInput(props)

const inputClasses = computed(() => {
  const base = 'block w-full py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition'
  const padding = hasIconSlot.value ? 'pl-10 pr-3' : 'px-3'
  return `${base} ${padding}`
})

const hasIconSlot = computed(() => !!useSlots().icon)

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

