export interface PasswordValidationResult {
  isValid: boolean
  errors: string[]
  strength: 'weak' | 'medium' | 'strong'
}

export type PasswordStrength = 'weak' | 'medium' | 'strong'
