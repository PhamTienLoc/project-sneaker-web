import { api, authService } from './authService'

class BrandService {
  async getAllBrands(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.page !== undefined) queryParams.append('page', params.page)
      if (params.size !== undefined) queryParams.append('size', params.size)
      if (params.sort) queryParams.append('sort', params.sort)
      
      const response = await api.get(`/brands?${queryParams.toString()}`)
      return response.data
    } catch (error) {
      console.error('Error getting brands:', error)
      throw error
    }
  }

  async getBrandById(id) {
    try {
      const response = await api.get(`/brands/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error getting brand ${id}:`, error)
      throw error
    }
  }
}

export const brandService = new BrandService()