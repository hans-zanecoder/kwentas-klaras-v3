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
}

