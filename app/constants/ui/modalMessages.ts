import { formatCurrency } from '~/utils/currency'

export const MODAL_MESSAGES = {
  CREATE_PROJECT: {
    title: 'Create Project',
    message: 'Are you sure you want to create this project? Please review all the information before confirming.',
    confirmText: 'Create Project',
    cancelText: 'Cancel',
    loadingText: 'Creating...',
  },
  UPDATE_PROJECT: {
    title: 'Update Project',
    message: 'Are you sure you want to update this project? Please review all the information before confirming.',
    confirmText: 'Update Project',
    cancelText: 'Cancel',
    loadingText: 'Updating...',
  },
  CREATE_USER: {
    title: 'Create User',
    message: 'Are you sure you want to create this user? Please review all the information before confirming.',
    confirmText: 'Create User',
    cancelText: 'Cancel',
    loadingText: 'Creating...',
  },
  UPDATE_USER: {
    title: 'Update User',
    message: 'Are you sure you want to update this user? Please review all the information before confirming.',
    confirmText: 'Update User',
    cancelText: 'Cancel',
    loadingText: 'Updating...',
  },
  DELETE_USER: {
    title: 'Delete User',
    message: 'Are you sure you want to delete this user? This action cannot be undone.',
    confirmText: 'Delete User',
    cancelText: 'Cancel',
    loadingText: 'Deleting...',
  },
  ADD_BUDGET: {
    title: 'Add Additional Budget',
    message: 'Are you sure you want to add this additional budget? Please review all the information before confirming.',
    confirmText: 'Add Budget',
    cancelText: 'Cancel',
    loadingText: 'Adding...',
  },
  ADD_OBLIGATION: {
    title: 'Add Obligation',
    message: 'Are you sure you want to add this obligation? Please review all the information before confirming.',
    confirmText: 'Add Obligation',
    cancelText: 'Cancel',
    loadingText: 'Adding...',
  },
  ADD_DISBURSEMENT: {
    title: 'Add Disbursement',
    message: 'Are you sure you want to add this disbursement? Please review all the information before confirming.',
    confirmText: 'Add Disbursement',
    cancelText: 'Cancel',
    loadingText: 'Adding...',
  },
  SAVE_LOCATION: {
    title: 'Save Location',
    message: 'Are you sure you want to save this location? The coordinates will be updated for this project.',
    confirmText: 'Save Location',
    cancelText: 'Cancel',
    loadingText: 'Saving...',
  },
  CLEAR_LOCATION: {
    title: 'Clear Location',
    message: 'Are you sure you want to clear the location? This will remove the coordinates from this project. This action cannot be undone.',
    confirmText: 'Clear Location',
    cancelText: 'Cancel',
    loadingText: 'Clearing...',
  },
  DEFAULT: {
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    loadingText: 'Processing...',
  },
} as const

export const getProjectConfirmMessage = (projectName?: string, appropriation?: number): string => {
  const formatAppropriation = (value: number): string => {
    return `₱${formatCurrency(value)}`
  }

  if (projectName && appropriation !== undefined) {
    return `Are you sure you want to create "${projectName}" with Appropriation of ${formatAppropriation(appropriation)}?`
  }
  if (projectName) {
    return `Are you sure you want to create "${projectName}"?`
  }
  if (appropriation !== undefined) {
    return `Are you sure you want to create this project with Appropriation of ${formatAppropriation(appropriation)}?`
  }
  return MODAL_MESSAGES.CREATE_PROJECT.message
}

export const getUserConfirmMessage = (userName?: string, role?: string, email?: string): string => {
  if (userName && role && email) {
    return `Are you sure you want to create "${userName}" as ${role} with email ${email}?`
  }
  if (userName && role) {
    return `Are you sure you want to create "${userName}" as ${role}?`
  }
  if (userName && email) {
    return `Are you sure you want to create "${userName}" with email ${email}?`
  }
  if (userName) {
    return `Are you sure you want to create "${userName}"?`
  }
  if (email) {
    return `Are you sure you want to create a user with email ${email}?`
  }
  return MODAL_MESSAGES.CREATE_USER.message
}

