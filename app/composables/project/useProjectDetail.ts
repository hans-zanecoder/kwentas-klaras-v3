import type { Project } from '~/types/project/project'
import type { AuditLog } from '~/types/project/auditLog'
import type { ProjectActivity } from '~/types/project/projectActivity'
import type { ProjectWithMetadata } from '~/types/project/projectDetail'
import { useProjects } from './useProjects'
import { useProjectFormatting } from './useProjectFormatting'
import { useProjectTimeline } from './useProjectTimeline'
import { PROJECT_DETAIL_TABS } from '~/constants/project/detailTabs'
import { AUDIT_LOG_STATUS_CLASSES, AUDIT_LOG_TITLES, getAuditLogDescription } from '~/constants/project/auditLogs'
import { useErrorHandler } from '../error/useErrorHandler'
import * as XLSX from 'xlsx'
import { stripHtmlTags } from '~/utils/htmlUtils'

export const useProjectDetail = (projectId: string) => {
  const { loading, error, fetchProject } = useProjects() as {
    loading: Ref<boolean>
    error: Ref<string | null>
    fetchProject: (projectId: string) => Promise<Project | null>
  }
  const { formatNumber, formatDate } = useProjectFormatting()

  const route = useRoute()
  const project = ref<Project | null>(null)
  const activeTab = ref(route.query.tab as string || 'summary')
  const activities = ref<ProjectActivity[]>([])
  const activitiesLoading = ref(false)

  const tabs = PROJECT_DETAIL_TABS

  watch(() => route.query.tab, (newTab) => {
    if (newTab && typeof newTab === 'string') {
      activeTab.value = newTab
    }
  })

  const formatDateTime = (date: string | Date | null | undefined): string => {
    if (!date) return 'N/A'
    const dateObj = typeof date === 'string' ? new Date(date) : date
    if (isNaN(dateObj.getTime())) return 'Invalid Date'
    return dateObj.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  const getTimeAgo = (date: string | Date | null | undefined): string => {
    if (!date) return 'Unknown time'
    const dateObj = typeof date === 'string' ? new Date(date) : date
    if (isNaN(dateObj.getTime())) return 'Invalid Date'
    const now = new Date()
    const diffMs = now.getTime() - dateObj.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`
    return formatDateTime(date)
  }

  const fetchActivities = async (projectId: string) => {
    activitiesLoading.value = true
    await useErrorHandler(async () => {
      const response = await $fetch<{ success: boolean; activities: ProjectActivity[] }>(`/api/projects/${projectId}/activities`)
      if (response.success) {
        activities.value = response.activities
      }
    }, {
      defaultMessage: 'Failed to fetch project activities',
    })
    activitiesLoading.value = false
  }

  const auditLogs = computed<AuditLog[]>(() => {
    if (activities.value.length > 0) {
      return activities.value.map((activity) => {
        let statusClass: string = AUDIT_LOG_STATUS_CLASSES.UPDATED
        let title = activity.action.charAt(0).toUpperCase() + activity.action.slice(1)

        if (activity.action === 'created') {
          statusClass = AUDIT_LOG_STATUS_CLASSES.CREATED
          title = AUDIT_LOG_TITLES.CREATED
        } else if (activity.action === 'updated') {
          statusClass = AUDIT_LOG_STATUS_CLASSES.UPDATED
          title = AUDIT_LOG_TITLES.UPDATED
        } else if (activity.action === 'started') {
          statusClass = AUDIT_LOG_STATUS_CLASSES.STARTED
          title = AUDIT_LOG_TITLES.STARTED
        } else if (activity.action === 'end_date_set') {
          statusClass = AUDIT_LOG_STATUS_CLASSES.END_DATE_SET
          title = AUDIT_LOG_TITLES.END_DATE_SET
        }

        return {
          title,
          description: activity.description,
          time: getTimeAgo(activity.createdAt),
          statusClass,
        }
      })
    }

    if (!project.value) return []

    const logs: AuditLog[] = []
    const projectData = project.value as ProjectWithMetadata

    if (projectData.createdAt) {
      logs.push({
        title: AUDIT_LOG_TITLES.CREATED,
        description: getAuditLogDescription('CREATED', project.value.name),
        time: getTimeAgo(projectData.createdAt),
        statusClass: AUDIT_LOG_STATUS_CLASSES.CREATED,
      })
    }

    return logs
  })

  const projectStatus = computed(() => {
    if (!project.value?.startDate || !project.value?.endDate) return 'Unknown'
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const startDate = new Date(project.value.startDate)
    const endDate = new Date(project.value.endDate)
    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(0, 0, 0, 0)

    if (startDate <= today && endDate >= today) {
      return 'Current'
    }
    if (endDate > today) {
      return 'Continuing'
    }
    return 'Completed'
  })

  const projectStatusClass = computed(() => {
    const status = projectStatus.value
    if (status === 'Current') return 'bg-green-100 text-green-800'
    if (status === 'Continuing') return 'bg-blue-100 text-blue-800'
    if (status === 'Completed') return 'bg-gray-100 text-gray-800'
    return 'bg-gray-100 text-gray-800'
  })

  const formatDuration = computed(() => {
    if (!project.value?.startDate || !project.value?.endDate) return 'N/A'
    const start = new Date(project.value.startDate)
    const end = new Date(project.value.endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const years = Math.floor(diffDays / 365)
    const months = Math.floor((diffDays % 365) / 30)
    
    if (years > 0) {
      return months > 0 ? `${years}Y ${months}M` : `${years}Y`
    }
    return months > 0 ? `${months}M` : `${diffDays}D`
  })

  const loadProject = async () => {
    if (!projectId) return
    
    const fetchedProject = await fetchProject(projectId)
    if (!fetchedProject || !fetchedProject.id) return
    
    const projectIdValue = fetchedProject.id
    project.value = fetchedProject
    await fetchActivities(projectIdValue)
  }

  const pieChartData = computed(() => {
    if (!project.value) return { series: [], options: {} }

    const appropriation = project.value.appropriation || 0
    const totalBudget = appropriation * 1.2
    const used = appropriation
    const remaining = Math.max(0, totalBudget - appropriation)
    const usedPercentage = totalBudget > 0 ? (used / totalBudget) * 100 : 0
    const remainingPercentage = Math.max(0, 100 - usedPercentage)

    return {
      series: [usedPercentage, remainingPercentage],
      options: {
        chart: {
          type: 'pie',
          height: 350,
        },
        colors: ['#3B82F6', '#E5E7EB'],
        labels: ['Allocated', 'Remaining'],
        legend: {
          position: 'bottom',
        },
        dataLabels: {
          enabled: true,
          formatter: (val: number) => `${val.toFixed(1)}%`,
        },
        tooltip: {
          y: {
            formatter: (val: number) => {
              const amount = totalBudget * (val / 100)
              return `₱${formatNumber(amount)} (${val.toFixed(1)}%)`
            },
          },
        },
      },
    }
  })

  const utilizationChartData = computed(() => {
    if (!project.value) return { series: [], options: {} }

    const appropriation = project.value.appropriation || 0
    const totalBudget = appropriation * 1.2
    const used = appropriation * 0.3
    const remaining = Math.max(0, totalBudget - used)
    const utilizationRate = totalBudget > 0 ? (used / totalBudget) * 100 : 0

    return {
      series: [utilizationRate, 100 - utilizationRate],
      options: {
        chart: {
          type: 'pie',
          height: 350,
        },
        colors: ['#10B981', '#E5E7EB'],
        labels: ['Utilized', 'Available'],
        legend: {
          position: 'bottom',
        },
        dataLabels: {
          enabled: true,
          formatter: (val: number) => `${val.toFixed(1)}%`,
        },
        tooltip: {
          y: {
            formatter: (val: number) => {
              const amount = totalBudget * (val / 100)
              return `₱${formatNumber(amount)} (${val.toFixed(1)}%)`
            },
          },
        },
      },
      utilizationRate: utilizationRate.toFixed(2),
    }
  })

  const { timelineProgress, timelineMilestones, daysRemaining } = useProjectTimeline(project, activities)

  const exportLogsToExcel = async () => {
    if (auditLogs.value.length === 0) return

    const workbook = XLSX.utils.book_new()
    
    const excelData = auditLogs.value.map((log, index) => {
      let dateTime = log.time
      if (activities.value.length > 0 && index < activities.value.length) {
        const activity = activities.value[index]
        if (activity) {
          dateTime = formatDateTime(activity.createdAt)
        }
      } else if (activities.value.length === 0 && project.value) {
        const projectData = project.value as ProjectWithMetadata
        if (projectData.createdAt) {
          dateTime = formatDateTime(projectData.createdAt)
        }
      }
      return {
        'Action': log.title,
        'Description': stripHtmlTags(log.description),
        'Date & Time': dateTime,
      }
    })

    const worksheet = XLSX.utils.json_to_sheet(excelData)
    
    const columnWidths = [
      { wch: 20 },
      { wch: 80 },
      { wch: 25 },
    ]
    worksheet['!cols'] = columnWidths

    const projectName = project.value?.name || 'Project'
    const sanitizedProjectName = projectName.replace(/[<>:"/\\|?*]/g, '_')
    const sheetName = 'Activity Log'
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

    const fileName = `${sanitizedProjectName}_Activity_Log_${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(workbook, fileName)

    // Log the excel download activity
    try {
      await $fetch(`/api/projects/${projectId}/activities/excel-download`, {
        method: 'POST',
      })
    } catch (err) {
      // Silently fail - don't break the export flow if logging fails
      console.error('Failed to log excel download activity:', err)
    }
  }

  return {
    project: readonly(project),
    loading: readonly(loading),
    error: readonly(error),
    activeTab,
    tabs,
    auditLogs,
    activitiesLoading: readonly(activitiesLoading),
    activities: readonly(activities),
    projectStatus,
    projectStatusClass,
    formatDuration,
    formatNumber,
    formatDate,
    loadProject,
    pieChartData,
    utilizationChartData,
    timelineProgress,
    timelineMilestones,
    daysRemaining,
    exportLogsToExcel,
  }
}

