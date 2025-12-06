import { useErrorHandler } from '../error/useErrorHandler'
import { useFirebase } from '../firebase/useFirebase'
import type { LoginForm } from '~/types/auth/login'
import { validateLoginForm } from '~/utils/loginValidation'

export const useLogin = () => {
  const form = reactive<LoginForm>({
    email: '',
    password: '',
  })

  const loading = ref(false)
  const error = ref('')
  const showPassword = ref(false)

  const handleLogin = async () => {
    error.value = ''
    loading.value = true

    const validationError = validateLoginForm(form)
    if (validationError) {
      error.value = validationError
      loading.value = false
      return
    }

    await useErrorHandler(async () => {
      const { login } = useFirebase()
      const user = await login(form.email, form.password)
      const idToken = await user.getIdToken()

      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { idToken }
      })

      if (response.success) {
        await navigateTo('/admin')
      }

      loading.value = false
    }, {
      defaultMessage: 'Invalid email or password. Please try again.',
      onError: (err) => {
        error.value = err.message
        loading.value = false
      }
    })
  }

  const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value
  }

  return {
    form,
    loading,
    error,
    showPassword,
    handleLogin,
    togglePasswordVisibility,
  }
}

