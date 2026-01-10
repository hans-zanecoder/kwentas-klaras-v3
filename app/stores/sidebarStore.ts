const collapsed = ref(false)

export const useSidebarStore = () => {
  const initialize = () => {
    if (process.client) {
      const savedState = localStorage.getItem('sidebar-collapsed')
      if (savedState !== null) {
        collapsed.value = JSON.parse(savedState)
      }
    }
  }

  const toggleCollapse = () => {
    collapsed.value = !collapsed.value
    if (process.client) {
      localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed.value))
    }
  }

  const setCollapsed = (value: boolean) => {
    collapsed.value = value
    if (process.client) {
      localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed.value))
    }
  }

  return {
    collapsed,
    initialize,
    toggleCollapse,
    setCollapsed,
  }
}
