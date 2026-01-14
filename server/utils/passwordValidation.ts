import zxcvbn from 'zxcvbn'
import type { PasswordValidationResult } from '../types/password/passwordValidation'

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = []
  let strength: 'weak' | 'medium' | 'strong' = 'weak'

  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      errors: ['Password is required'],
      strength: 'weak',
    }
  }

  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long')
  }

  if (password.length > 128) {
    errors.push('Password must be no more than 128 characters long')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }

  const zxcvbnResult = zxcvbn(password)
  
  if (zxcvbnResult.score < 2) {
    errors.push('Password is too weak. Please choose a stronger password')
  }

  if (zxcvbnResult.feedback.warning) {
    errors.push(zxcvbnResult.feedback.warning)
  }

  if (/(.)\1{2,}/.test(password)) {
    errors.push('Password cannot contain three or more consecutive identical characters')
  }

  if (errors.length === 0) {
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    const hasLength = password.length >= 16

    const criteriaMet = [hasUpper, hasLower, hasNumber, hasSpecial, hasLength].filter(Boolean).length
    const zxcvbnScore = zxcvbnResult.score

    if (criteriaMet >= 5 && password.length >= 16 && zxcvbnScore >= 3) {
      strength = 'strong'
    } else if (criteriaMet >= 4 && zxcvbnScore >= 2) {
      strength = 'medium'
    } else {
      strength = 'weak'
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  }
}

export function isPasswordStrong(password: string): boolean {
  const result = validatePassword(password)
  return result.isValid && result.strength === 'strong'
}
