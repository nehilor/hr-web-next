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

export const validatePersonForm = (data: {
  firstName: string
  lastName: string
  email: string
  position: string
  department: string
}): Record<string, string> => {
  const errors: Record<string, string> = {}

  const firstNameError = validateRequired(data.firstName, "First name")
  if (firstNameError) errors.firstName = firstNameError

  const lastNameError = validateRequired(data.lastName, "Last name")
  if (lastNameError) errors.lastName = lastNameError

  const emailError = validateEmail(data.email)
  if (emailError) errors.email = emailError

  const positionError = validateRequired(data.position, "Position")
  if (positionError) errors.position = positionError

  const departmentError = validateRequired(data.department, "Department")
  if (departmentError) errors.department = departmentError

  return errors
}

export const validateLoginForm = (data: {
  email: string
  password: string
}): Record<string, string> => {
  const errors: Record<string, string> = {}

  const emailError = validateEmail(data.email)
  if (emailError) errors.email = emailError

  const passwordError = validateRequired(data.password, "Password")
  if (passwordError) errors.password = passwordError

  return errors
}
