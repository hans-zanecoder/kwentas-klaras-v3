import type { TableProps } from '~/types/ui/table'

export const useTable = <T = any>(props: TableProps<T>) => {
  const hasData = computed(() => props.data.length > 0)

  const getColumnAlign = (align?: string) => {
    switch (align) {
      case 'center':
        return 'text-center'
      case 'right':
        return 'text-right'
      default:
        return 'text-left'
    }
  }

  return {
    hasData,
    getColumnAlign,
  }
}

