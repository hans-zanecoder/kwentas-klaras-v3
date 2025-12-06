<template>
  <div class="relative">
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <input
      :id="id"
      :value="modelValue"
      type="text"
      :placeholder="placeholder"
      class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      @input="handleInput"
    />
  </div>
</template>

<script setup lang="ts">
import type { SearchInputProps, SearchInputEmits } from '~/types/ui/searchInput'
import { useSearchInput } from '~/composables/ui/useSearchInput'

const props = withDefaults(defineProps<SearchInputProps>(), {
  id: undefined,
  placeholder: 'Search...',
})

const emit = defineEmits<SearchInputEmits>()

useSearchInput(props)

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

