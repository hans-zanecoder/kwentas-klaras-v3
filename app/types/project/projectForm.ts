export interface ProjectForm {
  name: string
  implementingUnit: string
  appropriation: number
  year: number
  startDate: string
  endDate: string
  services: string
}

export interface RequiredField {
  key: string
  value: () => string | number | boolean
}
