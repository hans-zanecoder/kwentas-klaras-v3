import type { Project } from '~/types/project/project'
import { TIMELINE_MILESTONE_CONFIGS } from '~/constants/project/timelineMilestones'

export const useProjectTimeline = (project: Ref<Project | null>) => {

  const timelineProgress = computed(() => {
    if (!project.value?.startDate || !project.value?.endDate) return 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const startDate = new Date(project.value.startDate)
    const endDate = new Date(project.value.endDate)
    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(0, 0, 0, 0)

    const totalDuration = endDate.getTime() - startDate.getTime()
    const elapsed = today.getTime() - startDate.getTime()

    if (totalDuration <= 0) return 0
    if (elapsed < 0) return 0
    if (elapsed > totalDuration) return 100

    return Math.round((elapsed / totalDuration) * 100)
  })

  const timelineMilestones = computed(() => {
    if (!project.value?.startDate || !project.value?.endDate) return []
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const startDate = new Date(project.value.startDate)
    const endDate = new Date(project.value.endDate)
    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(0, 0, 0, 0)

    const milestones = TIMELINE_MILESTONE_CONFIGS.map(config => ({
      label: config.label,
      date: config.getDate(startDate, endDate, today),
      isPast: config.getIsPast(startDate, endDate, today),
      isCurrent: config.getIsCurrent(startDate, endDate, today),
      isLast: config.isLast,
    }))

    const filtered = milestones.filter(m => m.isCurrent || m.label !== 'Today' || (today >= startDate && today <= endDate))
    
    return filtered.map((milestone, index) => ({
      ...milestone,
      isLast: index === filtered.length - 1,
    }))
  })

  const daysRemaining = computed(() => {
    if (!project.value?.endDate) return null
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const endDate = new Date(project.value.endDate)
    endDate.setHours(0, 0, 0, 0)

    const diff = endDate.getTime() - today.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

    return days
  })

  return {
    timelineProgress,
    timelineMilestones,
    daysRemaining,
  }
}

