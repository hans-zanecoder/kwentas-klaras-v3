import type { SubmitButtonProps } from '~/types/ui/submitButton'

export const useSubmitButton = (props: SubmitButtonProps) => {
  const isDisabled = computed(() => props.disabled || props.loading)

  return {
    isDisabled,
  }
}

