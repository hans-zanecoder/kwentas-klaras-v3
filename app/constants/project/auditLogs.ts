export const AUDIT_LOG_STATUS_CLASSES = {
  UPDATED: 'bg-blue-500',
  CREATED: 'bg-green-500',
  STARTED: 'bg-green-500',
  END_DATE_SET: 'bg-yellow-500',
} as const

export const AUDIT_LOG_TITLES = {
  UPDATED: 'Project Updated',
  CREATED: 'Project Created',
  STARTED: 'Project Started',
  END_DATE_SET: 'Project End Date Set',
} as const

export const getAuditLogDescription = (type: keyof typeof AUDIT_LOG_TITLES, projectName: string, additionalInfo?: string): string => {
  switch (type) {
    case 'UPDATED':
      return `Project "${projectName}" was updated`
    case 'CREATED':
      return `Project "${projectName}" was created`
    case 'STARTED':
      return `Project start date set to ${additionalInfo || ''}`
    case 'END_DATE_SET':
      return `Project end date set to ${additionalInfo || ''}`
    default:
      return `Project "${projectName}" activity`
  }
}

