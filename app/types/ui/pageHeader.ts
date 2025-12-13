export interface PageHeaderStat {
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  color: string
  title: string
  iconIndex?: number
}

export interface PageHeaderProps {
  title: string
  description: string
  buttonText?: string
  buttonAction?: () => void | Promise<void>
  stats?: PageHeaderStat[]
}

