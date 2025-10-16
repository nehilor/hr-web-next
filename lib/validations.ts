import { VALIDATION_MESSAGES } from "./constants"

export interface ValidationError {
  field: string
  message: string
}

export const validateEmail = (email: string): string | null => {
  if (!email) {
    return VALIDATION_MESSAGES.REQUIRED
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return VALIDATION_MESSAGES.INVALID_EMAIL
  }
  return null
}

export const validateRequired = (value: string, fieldName = "This field"): string | null => {
  if (!value || value.trim() === "") {
    return VALIDATION_MESSAGES.REQUIRED
  }
  return null
}