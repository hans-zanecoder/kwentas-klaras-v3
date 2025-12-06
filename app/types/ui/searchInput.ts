export interface SearchInputProps {
  id?: string
  modelValue: string
  placeholder?: string
}

export interface SearchInputEmits {
  (e: 'update:modelValue', value: string): void
}

