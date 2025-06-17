import { api, authService } from './authService'

class OrderService {
  async createOrder(orderData) {
    if (!authService.isAuthenticated()) {
      throw new Error('Bạn cần đăng nhập để đặt hàng')
    }
    // orderData: { paymentMethod, address, ... }
    const response = await api.post('/orders', orderData)
    return response.data
  }

  async getOrderById(orderId) {
    if (!authService.isAuthenticated()) {
      throw new Error('Bạn cần đăng nhập để xem đơn hàng')
    }
    const response = await api.get(`/orders/${orderId}`)
    return response.data
  }

  async getMyOrders() {
    if (!authService.isAuthenticated()) {
      throw new Error('Bạn cần đăng nhập để xem đơn hàng')
    }
    const response = await api.get('/orders/my-orders')
    return response.data
  }

  async getAllOrdersAdmin() {
    if (!authService.isAuthenticated()) {
      throw new Error('Bạn cần đăng nhập với quyền admin')
    }
    const response = await api.get('/orders/admin/all')
    return response.data
  }

  async updateOrderStatus(orderId, status) {
    if (!authService.isAuthenticated()) {
      throw new Error('Bạn cần đăng nhập để cập nhật đơn hàng')
    }
    const response = await api.put(`/orders/${orderId}/status?status=${status}`)
    return response.data
  }

  async cancelOrder(orderId) {
    if (!authService.isAuthenticated()) {
      throw new Error('Bạn cần đăng nhập để hủy đơn hàng')
    }
    const response = await api.delete(`/orders/${orderId}/cancel`)
    return response.data
  }
}

export const orderService = new OrderService() 