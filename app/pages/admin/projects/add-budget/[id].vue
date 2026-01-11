<template>
  <div class="h-screen bg-brand-bg flex overflow-hidden">
    <AdminSidebar />

    <main class="flex-1 flex flex-col overflow-hidden">
      <div :class="[...animations.pageContainerClasses.value]" class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-brand-bg">
        <div class="max-w-4xl mx-auto">
          <div :class="[...animations.sectionClasses.value]" class="mb-6">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h1 class="text-2xl font-extrabold text-brand-blue mb-2">Add Additional Budget</h1>
                <p class="text-sm text-brand-green">Fill in the budget details below</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                @click="goBack"
                class="text-brand-blue hover:text-brand-green"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Project</span>
              </Button>
            </div>
          </div>

          <div :class="[...animations.cardClasses.value]" class="bg-white rounded-xl shadow-sm border border-gray-300 p-6 lg:p-8">
            <form @submit.prevent="handleSubmit" class="space-y-8">
              <div class="space-y-6">
                <h2 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Budget Information
                </h2>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <CurrencyInput
                      id="amount"
                      v-model="form.amount"
                      label="Amount"
                      placeholder="Enter amount"
                      currency="PHP"
                      :precision="2"
                      :min="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      id="status"
                      v-model="form.status"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                    >
                      <option
                        v-for="option in BUDGET_STATUS_OPTIONS"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.name }}
                      </option>
                    </select>
                  </div>
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
                    class="block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue resize-none"
                    placeholder="Enter the reason for the additional budget request..."
                  ></textarea>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label for="approvedBy" class="block text-sm font-medium text-gray-700 mb-2">
                      Approved By
                    </label>
                    <input
                      id="approvedBy"
                      v-model="form.approvedBy"
                      type="text"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
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
                      class="block w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                    />
                  </div>
                </div>
              </div>

              <div v-if="error" class="mt-4">
                <ErrorMessage :message="error" />
              </div>

              <div class="flex items-center justify-end space-x-4 pt-4">
                <Button
                  variant="secondary"
                  size="md"
                  type="button"
                  @click="goBack"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  type="button"
                  @click="handleAddClick"
                  :loading="loading"
                  :disabled="loading || !isFormValid"
                >
                  <template #loading>{{ MODAL_MESSAGES.ADD_BUDGET.loadingText }}</template>
                  Add Budget
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>

    <ConfirmModal
      :is-open="showConfirmationModal"
      :title="MODAL_MESSAGES.ADD_BUDGET.title"
      :message="MODAL_MESSAGES.ADD_BUDGET.message"
      :confirm-text="MODAL_MESSAGES.ADD_BUDGET.confirmText"
      :cancel-text="MODAL_MESSAGES.ADD_BUDGET.cancelText"
      :loading="false"
      @confirm="onConfirmAdd"
      @cancel="closeConfirmModal"
    />

    <LoadingModal
      :show="showLoadingModal"
      title="Adding Budget"
      message="Please wait while we add the additional budget..."
      :duration="2000"
    />

    <SuccessModal
      :show="showSuccessModal"
      title="Budget Added Successfully"
      message="The additional budget has been added successfully."
      button-text="Close"
      :auto-close-seconds="3"
      count-down-message="Closing in"
      @close="handleSuccessClose"
    />
  </div>
</template>

<script setup lang="ts">
import Button from '~/components/ui/Button.vue'
import ErrorMessage from '~/components/ui/ErrorMessage.vue'
import CurrencyInput from '~/components/ui/CurrencyInput.vue'
import ConfirmModal from '~/components/ui/ConfirmModal.vue'
import SuccessModal from '~/components/ui/SuccessModal.vue'
import LoadingModal from '~/components/ui/LoadingModal.vue'
import { useBudgetForm } from '~/composables/budget/useBudgetForm'
import { usePageAnimations } from '~/composables/ui/usePageAnimations'
import { useFormModals } from '~/composables/ui/useFormModals'
import { MODAL_MESSAGES } from '~/constants/ui/modalMessages'
import { BUDGET_STATUS_OPTIONS } from '~/constants/additionalBudget/status'

const route = useRoute()
const router = useRouter()
const projectId = route.params.id as string
const animations = usePageAnimations()

const { form, loading, error, isFormValid, goBack, handleSubmit } = useBudgetForm(projectId)
const {
  showConfirmationModal,
  showLoadingModal,
  showSuccessModal,
  openConfirmModal,
  closeConfirmModal,
  startSubmission,
  closeSuccessModal,
} = useFormModals()

const handleAddClick = () => {
  if (isFormValid.value) {
    openConfirmModal()
  }
}

const onConfirmAdd = async () => {
  await startSubmission(handleSubmit)
}

const handleSuccessClose = () => {
  closeSuccessModal()
  goBack()
}

onMounted(() => {
  animations.markPageLoaded()
})
</script>
