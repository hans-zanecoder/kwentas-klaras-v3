import type { PasswordInputProps } from '~/types/ui/passwordInput'

export const usePasswordInput = (props: PasswordInputProps) => {
  const showPassword = ref(false)

  const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value
  }

  return {
    showPassword,
    togglePasswordVisibility,
  }
}

