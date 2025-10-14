export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE || "",
  ENDPOINTS: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    PEOPLE: "/people",
  },
} as const

export const QUERY_KEYS = {
  PEOPLE: "people",
  PERSON: "person",
} as const

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  PEOPLE_NEW: "/people/new",
  PEOPLE_EDIT: (id: string) => `/people/${id}/edit`,
} as const

export const VALIDATION_MESSAGES = {
  REQUIRED: "This field is required",
  INVALID_EMAIL: "Please enter a valid email address",
  MIN_LENGTH: (min: number) => `Must be at least ${min} characters`,
} as const

export const SEARCH_DEBOUNCE_MS = 300
