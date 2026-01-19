import { useFirebase } from '../firebase/useFirebase'
import { getAuth } from 'firebase/auth'

export const useAuthHeaders = async () => {
  const headers: Record<string, string> = {}

  // Get Firebase ID token
  if (process.client) {
    const { auth } = useFirebase()
    const firebaseAuth = auth.value
    const currentUser = firebaseAuth.currentUser

    if (currentUser) {
      try {
        const idToken = await currentUser.getIdToken()
        headers['Authorization'] = `Bearer ${idToken}`
      } catch (error) {
        console.error('Failed to get ID token:', error)
      }
    }
  }

  // Get CSRF token
  try {
    const csrfResponse = await $fetch<{ success: boolean; csrfToken: string }>('/api/csrf-token')
    if (csrfResponse.success && csrfResponse.csrfToken) {
      headers['x-csrf-token'] = csrfResponse.csrfToken
    }
  } catch (error) {
    console.error('Failed to get CSRF token:', error)
  }

  return headers
}
