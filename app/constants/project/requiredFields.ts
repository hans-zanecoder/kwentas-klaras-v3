import type { ProjectForm, RequiredField } from '~/types/project/projectForm'

export const getRequiredFields = (form: ProjectForm): RequiredField[] => [
  { key: 'name', value: () => form.name?.trim() },
  { key: 'implementingUnit', value: () => form.implementingUnit },
  { key: 'appropriation', value: () => form.appropriation > 0 },
  { key: 'year', value: () => form.year },
  { key: 'startDate', value: () => form.startDate },
  { key: 'endDate', value: () => form.endDate },
  { key: 'services', value: () => form.services?.trim() },
]
