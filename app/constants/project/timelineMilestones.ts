export interface TimelineMilestoneConfig {
  label: string
  getDate: (startDate: Date, endDate: Date, today: Date) => Date
  getIsPast: (startDate: Date, endDate: Date, today: Date) => boolean
  getIsCurrent: (startDate: Date, endDate: Date, today: Date) => boolean
  isLast: boolean
}

export const TIMELINE_MILESTONE_CONFIGS: TimelineMilestoneConfig[] = [
  {
    label: 'Project Start',
    getDate: (startDate) => startDate,
    getIsPast: (startDate, _, today) => today >= startDate,
    getIsCurrent: () => false,
    isLast: false,
  },
  {
    label: 'Today',
    getDate: (_, __, today) => today,
    getIsPast: () => false,
    getIsCurrent: (startDate, endDate, today) => today >= startDate && today <= endDate,
    isLast: false,
  },
  {
    label: 'Project End',
    getDate: (_, endDate) => endDate,
    getIsPast: (_, endDate, today) => today > endDate,
    getIsCurrent: () => false,
    isLast: true,
  },
]

