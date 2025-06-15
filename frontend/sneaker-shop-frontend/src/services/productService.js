import api from './api'

export const productService = {
  // Get all products with pagination
  getAllProducts: (params = {}) => {
    const queryParams = new URLSearchParams()
    
    if (params.page !== undefined) queryParams.append('page', params.page)
    if (params.size !== undefined) queryParams.append('size', params.size)
    if (params.sort) queryParams.append('sort', params.sort)
    
    return api.get(`/products?${queryParams.toString()}`)
  },

  // Get product by ID
  getProductById: (id) => {
    return api.get(`/products/${id}`)
  },

  // Filter products
  filterProducts: (filters = {}, params = {}) => {
    const queryParams = new URLSearchParams()
    
    // Pagination params
    if (params.page !== undefined) queryParams.append('page', params.page)
    if (params.size !== undefined) queryParams.append('size', params.size)
    if (params.sort) queryParams.append('sort', params.sort)
    
    // Filter params
    if (filters.brandId) queryParams.append('brandId', filters.brandId)
    if (filters.categoryIds && filters.categoryIds.length > 0) {
      filters.categoryIds.forEach(id => queryParams.append('categoryIds', id))
    }
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice)
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice)
    if (filters.keyword) queryParams.append('keyword', filters.keyword)
    if (filters.colors && filters.colors.length > 0) {
      filters.colors.forEach(color => queryParams.append('colors', color))
    }
    if (filters.sizes && filters.sizes.length > 0) {
      filters.sizes.forEach(size => queryParams.append('sizes', size))
    }
    if (filters.isActive !== undefined) queryParams.append('isActive', filters.isActive)
    
    return api.get(`/products/filter?${queryParams.toString()}`)
  },

  // Search products
  searchProducts: (keyword, params = {}) => {
    const queryParams = new URLSearchParams()
    queryParams.append('keyword', keyword)
    
    if (params.page !== undefined) queryParams.append('page', params.page)
    if (params.size !== undefined) queryParams.append('size', params.size)
    if (params.sort) queryParams.append('sort', params.sort)
    
    return api.get(`/products/search?${queryParams.toString()}`)
  },

  // Get related products
  getRelatedProducts: (productId) => {
    return api.get(`/products/${productId}/related`)
  },

  // Get products by brand
  getProductsByBrand: (brandId, params = {}) => {
    const queryParams = new URLSearchParams()
    
    if (params.page !== undefined) queryParams.append('page', params.page)
    if (params.size !== undefined) queryParams.append('size', params.size)
    if (params.sort) queryParams.append('sort', params.sort)
    
    return api.get(`/products/brand/${brandId}?${queryParams.toString()}`)
  },

  // Get products by category
  getProductsByCategory: (categoryId, params = {}) => {
    const queryParams = new URLSearchParams()
    
    if (params.page !== undefined) queryParams.append('page', params.page)
    if (params.size !== undefined) queryParams.append('size', params.size)
    if (params.sort) queryParams.append('sort', params.sort)
    
    return api.get(`/products/category/${categoryId}?${queryParams.toString()}`)
  },

  // Get product statistics
  getProductStatistics: (pageSize) => {
    const queryParams = new URLSearchParams()
    if (pageSize) queryParams.append('pageSize', pageSize)
    
    return api.get(`/products/stats?${queryParams.toString()}`)
  },

  // Get latest products
  getLatestProducts: (limit = 5) => {
    return api.get(`/products/latest?limit=${limit}`)
  },
}