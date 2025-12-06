export interface TextInputProps {
  id: string
  modelValue: string
  type?: string
  placeholder?: string
  required?: boolean
  autocomplete?: string
  label?: string
}

export interface TextInputEmits {
  (e: 'update:modelValue', value: string): void
}

