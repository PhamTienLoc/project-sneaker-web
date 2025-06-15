import { api, authService } from './authService'

class CartService {
  async getCartItems() {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error('User must be logged in to access cart')
      }
      const response = await api.get('/carts')
      return response.data
    } catch (error) {
      console.error('Error getting cart items:', error)
      throw error
    }
  }

  async addToCart(productId, quantity = 1, size = null, color = null) {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error('User must be logged in to add items to cart')
      }

      // Validate required fields
      if (!size || !color) {
        throw new Error('Size and color are required')
      }

      // Log the incoming parameters
      console.log('Adding to cart with parameters:', {
        productId,
        quantity,
        size,
        color
      })

      // Create the request payload
      const payload = {
        productId: Number(productId),
        quantity: Number(quantity),
        size: String(size),
        color: String(color)
      }

      // Log the final payload
      console.log('Request payload:', payload)
      console.log('Request headers:', api.defaults.headers)
      
      const response = await api.post('/carts/items', payload)
      console.log('Add to cart response:', response.data)
      return response.data
    } catch (error) {
      console.error('Error adding to cart:', error)
      if (error.response) {
        console.error('Error response data:', error.response.data)
        console.error('Error response status:', error.response.status)
        console.error('Error response headers:', error.response.headers)
        console.error('Request payload that caused error:', error.config?.data)
      }
      throw error
    }
  }

  async updateCartItem(cartItemId, quantity) {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error('User must be logged in to update cart')
      }
      const response = await api.put(`/carts/items/${cartItemId}`, {
        quantity: Number(quantity)
      })
      return response.data
    } catch (error) {
      console.error('Error updating cart item:', error)
      throw error
    }
  }

  async removeFromCart(cartItemId) {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error('User must be logged in to remove items from cart')
      }
      const response = await api.delete(`/carts/items/${cartItemId}`)
      return response.data
    } catch (error) {
      console.error('Error removing from cart:', error)
      throw error
    }
  }

  async clearCart() {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error('User must be logged in to clear cart')
      }
      const response = await api.delete('/carts')
      return response.data
    } catch (error) {
      console.error('Error clearing cart:', error)
      throw error
    }
  }
}

export const cartService = new CartService() 