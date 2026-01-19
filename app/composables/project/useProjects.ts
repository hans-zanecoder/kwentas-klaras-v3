import type { Project } from '~/types/project/project'
import { calculateProjectStats } from '~/constants/project/projectStats'
import { useErrorHandler } from '../error/useErrorHandler'
import { useAuthHeaders } from '../auth/useAuthHeaders'

export const useProjects = () => {
  const projects = ref<Project[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const saveError = ref<string | null>(null)

  const fetchProjects = async () => {
    loading.value = true
    error.value = null

    await useErrorHandler(async () => {
      const response = await $fetch<{ success: boolean; projects: Project[] }>('/api/projects')
      if (response.success) {
        projects.value = response.projects
      }
    }, {
      defaultMessage: 'Failed to fetch projects',
      onError: (err) => {
        error.value = err.message
      }
    })

    loading.value = false
  }

  const fetchProject = async (projectId: string) => {
    loading.value = true
    error.value = null

    let project: Project | null = null

    await useErrorHandler(async () => {
      const response = await $fetch<{ success: boolean; project: Project }>(`/api/projects/${projectId}`)
      if (response.success) {
        project = response.project
      }
    }, {
      defaultMessage: 'Failed to fetch project',
      onError: (err) => {
        error.value = err.message
      }
    })

    loading.value = false
    return project
  }

  const createProject = async (projectData: Project) => {
    loading.value = true
    error.value = null

    await useErrorHandler(async () => {
      const headers = await useAuthHeaders()
      const response = await $fetch<{ success: boolean; project: Project }>('/api/projects/create', {
        method: 'POST',
        headers,
        body: projectData,
      })

      if (response.success) {
        projects.value.push(response.project)
        return response.project
      }
    }, {
      defaultMessage: 'Failed to create project',
      onError: (err) => {
        error.value = err.message
        throw err
      }
    })

    loading.value = false
  }

  const updateProject = async (projectId: string, projectData: Partial<Project>) => {
    loading.value = true
    error.value = null

    await useErrorHandler(async () => {
      const response = await $fetch<{ success: boolean; project: Project }>(`/api/projects/${projectId}`, {
        method: 'PUT',
        body: projectData,
      })

      if (response.success) {
        const index = projects.value.findIndex(p => p.id === projectId)
        if (index !== -1) {
          projects.value[index] = response.project
        }
        return response.project
      }
    }, {
      defaultMessage: 'Failed to update project',
      onError: (err) => {
        error.value = err.message
        throw err
      }
    })

    loading.value = false
  }

  const deleteProject = async (projectId: string) => {
    loading.value = true
    error.value = null

    await useErrorHandler(async () => {
      const response = await $fetch<{ success: boolean }>(`/api/projects/${projectId}`, {
        method: 'DELETE',
      })

      if (response.success) {
        projects.value = projects.value.filter(p => p.id !== projectId)
      }
    }, {
      defaultMessage: 'Failed to delete project',
      onError: (err) => {
        error.value = err.message
        throw err
      }
    })

    loading.value = false
  }

  const handleDelete = async (project: Project) => {
    if (confirm(`Are you sure you want to delete "${project.name}"?`)) {
      if (project.id) {
        await deleteProject(project.id)
      }
    }
  }

  const handleSaveProject = async (projectData: Project, editingProject: Project | null) => {
    saveError.value = null

    await useErrorHandler(async () => {
      if (editingProject && editingProject.id) {
        await updateProject(editingProject.id, projectData)
      } else {
        await createProject(projectData)
      }
    }, {
      defaultMessage: 'Failed to save project',
      onError: (err) => {
        saveError.value = err.message
      }
    })
  }

  const projectStats = computed(() => {
    const totalProjects = projects.value.length
    const totalAppropriation = projects.value.reduce((sum, p) => sum + (p.appropriation || 0), 0)
    const uniqueYears = new Set(projects.value.map(p => p.year)).size
    const uniqueUnits = new Set(projects.value.map(p => p.implementingUnit)).size

    return calculateProjectStats(totalProjects, totalAppropriation, uniqueYears, uniqueUnits)
  })

  return {
    projects: readonly(projects),
    loading: readonly(loading),
    error: readonly(error),
    saveError,
    projectStats,
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
    handleDelete,
    handleSaveProject,
  }
}

