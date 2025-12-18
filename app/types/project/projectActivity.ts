export interface ProjectActivity {
  id: string
  projectId: string
  action: string
  description: string
  userId?: string
  metadata?: string
  createdAt: string | Date
}

