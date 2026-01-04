<template>
  <div class="h-screen bg-brand-bg flex overflow-hidden">
    <AdminSidebar />
    
    <main class="flex-1 flex flex-col overflow-hidden">
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-brand-bg">
        <div class="space-y-6 min-h-full flex flex-col">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-1">Check Payment</h1>
              <p class="text-sm text-gray-500">View and manage payment records</p>
            </div>
            <div class="flex items-center gap-4">
              <div class="flex-1 max-w-md">
                <SearchInput
                  v-model="searchQuery"
                  placeholder="Search by payee, project, or amount..."
                />
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            <StatCard
              v-for="(stat, index) in displayStats"
              :key="index"
              :title="stat.title"
              :value="stat.value"
              :change="stat.change"
              :change-type="stat.changeType"
              :icon-bg-color="getIconBgColor(stat.color)"
              :icon-color="stat.iconColor"
            >
              <template #icon>
                <svg v-if="index === 0" :class="`w-6 h-6 ${stat.iconColor}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg v-else-if="index === 1" :class="`w-6 h-6 ${stat.iconColor}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg v-else :class="`w-6 h-6 ${stat.iconColor}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </template>
            </StatCard>
          </div>

          <section class="relative overflow-hidden rounded-2xl border border-gray-300 p-6 bg-white flex-1 min-h-[600px] flex flex-col">
            <div v-if="loading" class="text-center py-12 flex-1 flex items-center justify-center">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
              <p class="mt-4 text-gray-600">Loading payments...</p>
            </div>

            <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-red-700">{{ error }}</p>
              </div>
            </div>

            <div v-else-if="filteredPayments.length === 0" class="text-center py-12 flex-1 flex items-center justify-center">
              <div class="text-gray-400 mb-2">
                <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p class="text-gray-600 font-medium">No payments found</p>
              <p class="text-sm text-gray-500 mt-1">Try adjusting your search criteria.</p>
            </div>

            <div v-else class="flex-1 overflow-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50 sticky top-0">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payee
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="payment in filteredPayments" :key="payment.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{{ payment.payee }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ payment.projectName || 'N/A' }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-semibold text-gray-900">₱{{ formatNumber(payment.amount) }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="[
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                        payment.status === 'approved' ? 'bg-green-100 text-green-800' :
                        payment.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      ]">
                        {{ payment.status?.charAt(0).toUpperCase() + payment.status?.slice(1) || 'Pending' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(payment.createdAt) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        @click="viewPaymentDetails(payment)"
                        class="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-if="filteredPayments.length > 0" class="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
              <div class="text-sm text-gray-600">
                Showing <span class="font-bold text-gray-900">{{ filteredPayments.length }}</span> of <span class="font-bold text-gray-900">{{ payments.length }}</span> payments
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import StatCard from '~/components/ui/StatCard.vue'
import SearchInput from '~/components/ui/SearchInput.vue'
import { getIconBgColor } from '~/constants/ui/statColors'
import { useProjectFormatting } from '~/composables/project/useProjectFormatting'

const searchQuery = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const payments = ref<any[]>([])

const { formatNumber, formatDate } = useProjectFormatting()

// Mock data for now - replace with actual API call
onMounted(async () => {
  loading.value = true
  try {
    // TODO: Replace with actual API call
    // const response = await $fetch('/api/payments')
    // payments.value = response.payments || []
    
    // Mock data
    payments.value = []
  } catch (err: any) {
    error.value = err?.message || 'Failed to load payments'
  } finally {
    loading.value = false
  }
})

const filteredPayments = computed(() => {
  if (!searchQuery.value.trim()) {
    return payments.value
  }

  const query = searchQuery.value.toLowerCase()
  return payments.value.filter(payment => {
    return (
      payment.payee?.toLowerCase().includes(query) ||
      payment.projectName?.toLowerCase().includes(query) ||
      payment.amount?.toString().includes(query)
    )
  })
})

const displayStats = computed(() => [
  {
    title: 'Total Payments',
    value: payments.value.length.toString(),
    change: '0',
    changeType: 'neutral' as 'positive' | 'negative' | 'neutral',
    iconColor: 'text-brand-blue',
    color: 'blue'
  },
  {
    title: 'Approved',
    value: payments.value.filter(p => p.status === 'approved').length.toString(),
    change: '0',
    changeType: 'positive' as 'positive' | 'negative' | 'neutral',
    iconColor: 'text-brand-green',
    color: 'green'
  },
  {
    title: 'Pending',
    value: payments.value.filter(p => p.status === 'pending').length.toString(),
    change: '0',
    changeType: 'neutral' as 'positive' | 'negative' | 'neutral',
    iconColor: 'text-yellow-600',
    color: 'yellow'
  }
])

const viewPaymentDetails = (payment: any) => {
  // TODO: Navigate to payment details page or open modal
  console.log('View payment:', payment)
}
</script>

