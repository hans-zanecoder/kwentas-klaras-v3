import { useSidebarStore } from '~/stores/sidebarStore'
import type { AdminMenuItem } from '~/types/admin/menu'

export function useSidebar(menuItems: AdminMenuItem[]) {
  const route = useRoute()
  const sidebarStore = useSidebarStore()
  const expandedItems = ref<string[]>([])

  const toggleCollapse = () => {
    sidebarStore.toggleCollapse()
  }

  const isRouteActive = (path: string): boolean => {
    if (!path) {
      return false
    }

    if (path === '/admin') {
      return route.path === '/admin'
    }

    return route.path.startsWith(path)
  }

  const isItemActive = (item: AdminMenuItem): boolean => {
    return isRouteActive(item.path)
  }

  const toggleMenuItem = (itemPath: string) => {
    if (sidebarStore.collapsed.value) {
      sidebarStore.setCollapsed(false)
    }
    const index = expandedItems.value.indexOf(itemPath)
    if (index > -1) {
      expandedItems.value.splice(index, 1)
    } else {
      expandedItems.value.push(itemPath)
    }
  }

  const handleLogout = async () => {
    await navigateTo('/auth/login')
  }

  onMounted(() => {
    if (process.client) {
      sidebarStore.initialize()
    }
  })

  return {
    collapsed: sidebarStore.collapsed,
    expandedItems,
    toggleCollapse,
    isRouteActive,
    isItemActive,
    toggleMenuItem,
    handleLogout,
  }
}
