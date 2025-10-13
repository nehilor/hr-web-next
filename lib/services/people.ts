import { apiService } from "./api"
import { API_CONFIG } from "../constants"
import type { Person, PersonFormData, PeopleResponse } from "../types"

export const peopleService = {
  async getPeople(query?: string): Promise<Person[]> {
    const endpoint = query
      ? `${API_CONFIG.ENDPOINTS.PEOPLE}?q=${encodeURIComponent(query)}`
      : API_CONFIG.ENDPOINTS.PEOPLE

    const response = await apiService.get<PeopleResponse>(endpoint)

    // Handle paginated response from backend
    return response.items || []
  },

  async getPerson(id: string): Promise<Person> {
    return apiService.get<Person>(`${API_CONFIG.ENDPOINTS.PEOPLE}/${id}`)
  },

  async createPerson(data: PersonFormData): Promise<Person> {
    return apiService.post<Person>(API_CONFIG.ENDPOINTS.PEOPLE, data)
  },

  async updatePerson(id: string, data: PersonFormData): Promise<Person> {
    return apiService.patch<Person>(`${API_CONFIG.ENDPOINTS.PEOPLE}/${id}`, data)
  },

  async deletePerson(id: string): Promise<void> {
    return apiService.delete<void>(`${API_CONFIG.ENDPOINTS.PEOPLE}/${id}`)
  },
}
