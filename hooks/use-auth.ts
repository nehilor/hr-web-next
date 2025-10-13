"use client"

import { create } from "zustand"
import { apiService } from "@/lib/services/api"
import { authService } from "@/lib/services/auth"

interface AuthState {
  token: string | null
  isAuthenticated: boolean
  user: { id: string; email: string; role: string; firstName: string; lastName: string } | null
  isLoading: boolean
  setToken: (token: string) => void
  clearToken: () => void
  checkAuth: () => Promise<void>
}

export const useAuth = create<AuthState>((set, get) => ({
  token: null,
  isAuthenticated: false,
  user: null,
  isLoading: true,

  setToken: (token: string) => {
    set({ token, isAuthenticated: true })
    apiService.setToken(token)
  },

  clearToken: () => {
    set({ token: null, isAuthenticated: false, user: null })
    apiService.setToken(null)
    authService.logout()
  },

  checkAuth: async () => {
    set({ isLoading: true })

    try {
      // Get token from cookies
      const cookies = document.cookie.split(';')
      const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth-token='))

      if (!authCookie) {
        set({ isLoading: false, isAuthenticated: false, token: null, user: null })
        return
      }

      const token = authCookie.split('=')[1]

      // Check if token is valid (not expired)
      if (!authService.isTokenValid(token)) {
        set({ isLoading: false, isAuthenticated: false, token: null, user: null })
        authService.logout()
        return
      }

      // Set token in API service
      apiService.setToken(token)

      // Verify token with backend
      const user = await authService.getProfile()

      set({
        token,
        isAuthenticated: true,
        user,
        isLoading: false
      })
    } catch (error) {
      console.error('Auth check failed:', error)
      set({
        isLoading: false,
        isAuthenticated: false,
        token: null,
        user: null
      })
      authService.logout()
    }
  },
}))
