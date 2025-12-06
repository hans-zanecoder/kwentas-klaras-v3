import type { Project } from '~/types/project/project'

export const useProjectModal = (saveError?: Ref<string | null>) => {
  const isModalOpen = ref(false)
  const editingProject = ref<Project | null>(null)

  const openAddModal = () => {
    editingProject.value = null
    isModalOpen.value = true
  }

  const openEditModal = (project: Project) => {
    editingProject.value = { ...project }
    isModalOpen.value = true
  }

  const closeModal = () => {
    isModalOpen.value = false
    editingProject.value = null
    if (saveError) {
      saveError.value = null
    }
  }

  return {
    isModalOpen,
    editingProject,
    openAddModal,
    openEditModal,
    closeModal,
  }
}

