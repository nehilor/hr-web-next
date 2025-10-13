import { apiService } from "./api"
import { API_CONFIG } from "../constants"
import type { LoginCredentials, RegisterCredentials, AuthResponse } from "../types"

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(API_CONFIG.ENDPOINTS.LOGIN, credentials)

    if (response.accessToken) {
      apiService.setToken(response.accessToken)
    }

    return response
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(API_CONFIG.ENDPOINTS.REGISTER, credentials)

    if (response.accessToken) {
      apiService.setToken(response.accessToken)
    }

    return response
  },

  async getProfile() {
    return apiService.get<{ id: string; email: string; role: string; firstName: string; lastName: string }>('/auth/me')
  },

  logout() {
    apiService.setToken(null)
    // Clear cookie
    if (typeof document !== 'undefined') {
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }
  },

  getToken() {
    return apiService.getToken()
  },

  isTokenValid(token: string): boolean {
    try {
      // Decode JWT without verification (just to check structure and expiration)
      const payload = JSON.parse(atob(token.split('.')[1]))
      const now = Math.floor(Date.now() / 1000)
      return payload.exp > now
    } catch {
      return false
    }
  },
}
