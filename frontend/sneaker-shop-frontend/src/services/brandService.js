import api from './api'

export const brandService = {
  // Get all brands with pagination
  getAllBrands: (params = {}) => {
    const queryParams = new URLSearchParams()
    
    if (params.page !== undefined) queryParams.append('page', params.page)
    if (params.size !== undefined) queryParams.append('size', params.size)
    if (params.sort) queryParams.append('sort', params.sort)
    
    return api.get(`/brands?${queryParams.toString()}`)
  },

  // Get brand by ID
  getBrandById: (id) => {
    return api.get(`/brands/${id}`)
  },
}