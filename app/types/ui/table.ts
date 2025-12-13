export interface TableColumn {
  key: string
  label: string
  align?: 'left' | 'center' | 'right'
}

export interface TableProps<T = any> {
  columns: TableColumn[]
  data: T[]
  keyField?: string
  emptyMessage?: string
  emptyDescription?: string
  showCheckbox?: boolean
  showSearch?: boolean
  searchPlaceholder?: string
  showFilter?: boolean
  filterLabel?: string
}

export interface TableEmits {
  (e: 'search', value: string): void
  (e: 'filter-click'): void
  (e: 'select-all', checked: boolean): void
  (e: 'row-select', row: any, checked: boolean): void
  (e: 'selection-change', selectedKeys: any[]): void
}

