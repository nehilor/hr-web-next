export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000",
  ENDPOINTS: {
    EVENTS: "/api/events",
  },
} as const

export const ROUTES = {
  HOME: "/",
  TEST: "/test",
  MONITORING: "/monitoring",
} as const