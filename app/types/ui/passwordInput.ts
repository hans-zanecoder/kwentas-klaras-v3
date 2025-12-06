export interface PasswordInputProps {
  id: string
  modelValue: string
  placeholder?: string
  required?: boolean
  autocomplete?: string
  label?: string
}

export interface PasswordInputEmits {
  (e: 'update:modelValue', value: string): void
}

