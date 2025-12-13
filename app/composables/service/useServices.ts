export interface Service {
  id: string
  name: string
}

export const useServices = () => {
  const services = ref<Service[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchServices = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{ success: boolean; services: Service[] }>('/api/services')
      if (response.success) {
        services.value = response.services
      }
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch services'
    } finally {
      loading.value = false
    }
  }

  return {
    services,
    loading,
    error,
    fetchServices,
  }
}
