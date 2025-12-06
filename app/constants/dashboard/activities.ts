export interface Activity {
  title: string
  description: string
  time: string
}

export const DASHBOARD_ACTIVITIES: Activity[] = [
  { title: 'New user registered', description: 'John Doe joined the platform', time: '2 hours ago' },
  { title: 'Project updated', description: 'Website redesign moved to in-progress', time: '5 hours ago' },
  { title: 'Task completed', description: 'UI mockups finalized and approved', time: '1 day ago' },
  { title: 'Meeting scheduled', description: 'Team sync meeting tomorrow at 10 AM', time: '2 days ago' },
]

