import type { Project } from '~/types/project/project'

export const useProjectSearch = (projects: Readonly<Ref<readonly Project[]>>, searchQuery: Ref<string>) => {
  const filteredProjects = computed(() => {
    if (!searchQuery.value.trim()) {
      return projects.value
    }
    
    const query = searchQuery.value.toLowerCase()
    return projects.value.filter((project: Project) => 
      project.name.toLowerCase().includes(query) ||
      project.services.toLowerCase().includes(query) ||
      project.implementingUnit.toLowerCase().includes(query)
    )
  })

  return {
    filteredProjects,
  }
}

