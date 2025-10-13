export interface Person {
  id: string
  firstName: string
  lastName: string
  email: string
  position?: string
  department?: string
  startDate?: string
  managerId?: string
  createdAt: string
  updatedAt: string
}

export interface PersonFormData {
  firstName: string
  lastName: string
  email: string
  position?: string
  department?: string
  startDate?: string
  managerId?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface AuthResponse {
  accessToken: string
  user?: {
    id: string
    email: string
    name?: string
  }
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

export interface PeopleResponse {
  page: number
  pageSize: number
  total: number
  items: Person[]
}
