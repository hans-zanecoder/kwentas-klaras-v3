import { ref } from 'vue'
import { useConfirmModal } from './useConfirmModal'
import { asyncHandler } from '~/utils/asyncHandler'

export const useFormModals = () => {
  const { isOpen: showConfirmationModal, close: closeConfirmModal } = useConfirmModal()
  const showLoadingModal = ref(false)
  const showSuccessModal = ref(false)

  const openConfirmModal = () => {
    showConfirmationModal.value = true
  }

  const startSubmission = async (
    submitFn: () => Promise<void | unknown>,
    onSuccess?: () => void
  ) => {
    closeConfirmModal()
    showLoadingModal.value = true

    const { data, error: submitError } = await asyncHandler(submitFn())

    showLoadingModal.value = false

    if (!submitError) {
      if (onSuccess) {
        onSuccess()
      }
      showSuccessModal.value = true
    }
  }

  const closeSuccessModal = () => {
    showSuccessModal.value = false
  }

  const reset = () => {
    closeConfirmModal()
    showLoadingModal.value = false
    showSuccessModal.value = false
  }

  return {
    showConfirmationModal,
    showLoadingModal,
    showSuccessModal,
    openConfirmModal,
    closeConfirmModal,
    startSubmission,
    closeSuccessModal,
    reset,
  }
}
