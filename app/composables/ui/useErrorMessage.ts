import type { ErrorMessageProps } from '~/types/ui/errorMessage'

export const useErrorMessage = (props: ErrorMessageProps) => {
  const hasError = computed(() => !!props.message)

  return {
    hasError,
  }
}

