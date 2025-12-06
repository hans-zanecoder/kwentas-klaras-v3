import type { LoginForm } from '~/types/auth/login'

export const validateLoginForm = (form: LoginForm): string | null => {
  if (!form.email.trim()) {
    return 'Email is required'
  }

  if (!form.password.trim()) {
    return 'Password is required'
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email)) {
    return 'Please enter a valid email address'
  }

  return null
}
