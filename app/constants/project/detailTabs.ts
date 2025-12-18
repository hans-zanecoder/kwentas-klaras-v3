export const PROJECT_DETAIL_TABS = [
  { id: 'summary', label: 'Project Summary' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'details', label: 'Details' },
  { id: 'budget', label: 'Budget' },
  { id: 'obligations', label: 'Obligations' },
  { id: 'disbursements', label: 'Disbursements' },
  { id: 'logs', label: 'Logs' },
  { id: 'documents', label: 'Documents' },
] as const

export type ProjectDetailTabId = typeof PROJECT_DETAIL_TABS[number]['id']

export const TAB_IDS = {
  SUMMARY: 'summary',
  TIMELINE: 'timeline',
  DETAILS: 'details',
  BUDGET: 'budget',
  OBLIGATIONS: 'obligations',
  DISBURSEMENTS: 'disbursements',
  LOGS: 'logs',
  DOCUMENTS: 'documents',
} as const

