import type { TextInputProps } from '~/types/ui/textInput'

export const useTextInput = (props: TextInputProps) => {
  const updateValue = (value: string) => {
    return value
  }

  return {
    updateValue,
  }
}

