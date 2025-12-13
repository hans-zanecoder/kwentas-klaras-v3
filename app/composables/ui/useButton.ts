import type { ButtonProps } from '~/types/ui/button'

export const useButton = (props: ButtonProps) => {
  const buttonClasses = computed(() => {
    const base = 'flex items-center justify-center font-medium transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2'
    
    const variants = {
      primary: 'text-white border border-transparent rounded-lg shadow-sm hover:[background-color:#22C98D] focus:ring-blue-500',
      secondary: 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg focus:ring-gray-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 border border-transparent rounded-lg shadow-sm focus:ring-red-500',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 rounded-lg focus:ring-gray-500',
    }
    
    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    }
    
    const primaryStyle = props.variant === 'primary' ? 'background-color: #2563EB;' : undefined
    
    return {
      classes: `${base} ${variants[props.variant || 'primary']} ${sizes[props.size || 'md']}`,
      primaryStyle,
    }
  })

  return {
    buttonClasses,
  }
}

