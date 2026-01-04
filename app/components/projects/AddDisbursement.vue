<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[9999] overflow-y-auto" @click.self="closeModal">
      <div class="fixed inset-0 backdrop-blur-md" @click="closeModal" style="background-color: rgba(0, 0, 0, 0.1); transition: none;"></div>

      <div class="flex min-h-full items-center justify-center p-4">
        <div class="relative bg-white rounded-lg shadow-xl w-full max-w-2xl animate-fade-in" @click.stop>
          <div class="px-6 pt-6 pb-4">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-semibold leading-6 text-gray-900">
                Add Disbursement
              </h3>
              <button @click="closeModal" class="text-gray-400 hover:text-gray-500 transition cursor-pointer">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div class="space-y-4">
                <div>
                  <label for="amount" class="block text-sm font-medium text-gray-700 mb-2">
                    Amount <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₱</span>
                    <input
                      id="amount"
                      v-model.number="form.amount"
                      type="number"
                      required
                      min="0.01"
                      step="0.01"
                      class="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label for="payee" class="block text-sm font-medium text-gray-700 mb-2">
                    Payee <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="payee"
                    v-model="form.payee"
                    type="text"
                    required
                    class="block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter payee name"
                  />
                </div>

                <div>
                  <label for="reason" class="block text-sm font-medium text-gray-700 mb-2">
                    Reason <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    id="reason"
                    v-model="form.reason"
                    required
                    rows="4"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Enter the reason for the disbursement..."
                  ></textarea>
                </div>

                <div>
                  <label for="approvedBy" class="block text-sm font-medium text-gray-700 mb-2">
                    Approved By
                  </label>
                  <input
                    id="approvedBy"
                    v-model="form.approvedBy"
                    type="text"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Name of approver"
                  />
                </div>

                <div>
                  <label for="approvedDate" class="block text-sm font-medium text-gray-700 mb-2">
                    Approved Date
                  </label>
                  <input
                    id="approvedDate"
                    v-model="form.approvedDate"
                    type="date"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div v-if="error" class="rounded-lg bg-red-50 border border-red-200 p-3">
                <p class="text-sm text-red-800">{{ error }}</p>
              </div>

              <div class="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  @click="closeModal"
                  class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="loading"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span v-if="!loading">Add Disbursement</span>
                  <span v-else class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
  projectId: string
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  projectId: ''
})

const emit = defineEmits<{
  close: []
  save: [disbursement: { projectId: string; amount: number; reason: string; payee: string; approvedBy?: string; approvedDate?: string }]
}>()

const form = ref({
  amount: 0,
  payee: '',
  reason: '',
  approvedBy: '',
  approvedDate: ''
})

const error = ref('')
const loading = ref(false)

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    resetForm()
    error.value = ''
  }
})

const resetForm = () => {
  form.value = {
    amount: 0,
    payee: '',
    reason: '',
    approvedBy: '',
    approvedDate: ''
  }
  error.value = ''
}

const closeModal = () => {
  resetForm()
  emit('close')
}

const handleSubmit = async () => {
  error.value = ''
  loading.value = true

  try {
    if (!form.value.amount || form.value.amount <= 0) {
      error.value = 'Amount must be greater than 0'
      loading.value = false
      return
    }

    if (!form.value.payee.trim()) {
      error.value = 'Payee is required'
      loading.value = false
      return
    }

    if (!form.value.reason.trim()) {
      error.value = 'Reason is required'
      loading.value = false
      return
    }

    const disbursementData = {
      projectId: props.projectId,
      amount: form.value.amount,
      payee: form.value.payee.trim(),
      reason: form.value.reason.trim(),
      approvedBy: form.value.approvedBy.trim() || undefined,
      approvedDate: form.value.approvedDate || undefined,
    }

    emit('save', disbursementData)
    closeModal()
  } catch (err: any) {
    error.value = err?.message || 'An error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}
</style>

