import type { ButtonProps } from '~/types/ui/button'

export const useButton = (props: ButtonProps) => {
  const buttonClasses = computed(() => {
    const base = 'flex items-center justify-center font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variants = {
      primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
      danger: 'bg-red-600 text-white hover:bg-red-700',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
    }
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-md',
      md: 'px-4 py-2 text-sm rounded-lg',
      lg: 'px-6 py-3 text-base rounded-lg',
    }
    
    return `${base} ${variants[props.variant || 'primary']} ${sizes[props.size || 'md']}`
  })

  return {
    buttonClasses,
  }
}

