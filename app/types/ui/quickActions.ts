export interface QuickAction {
  label: string
  variant?: 'primary' | 'secondary'
  onClick?: () => void
}

export interface QuickActionsProps {
  actions: QuickAction[]
  title?: string
}

