import api from './api'

export const categoryService = {
  // Get all categories with pagination
  getAllCategories: (params = {}) => {
    const queryParams = new URLSearchParams()
    
    if (params.page !== undefined) queryParams.append('page', params.page)
    if (params.size !== undefined) queryParams.append('size', params.size)
    if (params.sort) queryParams.append('sort', params.sort)
    
    return api.get(`/categories?${queryParams.toString()}`)
  },

  // Get category by ID
  getCategoryById: (id) => {
    return api.get(`/categories/${id}`)
  },
}