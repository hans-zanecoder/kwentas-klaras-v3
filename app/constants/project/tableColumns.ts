import type { TableColumn } from '~/types/ui/table'

export const PROJECT_TABLE_COLUMNS: TableColumn[] = [
  { key: 'name', label: 'Project Name', align: 'left' },
  { key: 'implementingUnit', label: 'Implementing Unit', align: 'left' },
  { key: 'appropriation', label: 'Appropriation', align: 'left' },
  { key: 'year', label: 'Year', align: 'left' },
  { key: 'duration', label: 'Duration', align: 'left' },
  { key: 'actions', label: 'Actions', align: 'right' },
]

