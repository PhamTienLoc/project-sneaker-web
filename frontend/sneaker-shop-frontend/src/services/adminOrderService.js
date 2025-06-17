import api from './api';

export const adminOrderService = {
  getAll: () => api.get('/orders/admin/all'),
  getById: (id) => api.get(`/orders/${id}`),
  update: (id, status) => api.put(`/orders/${id}/status?status=${status}`),
  delete: (id) => api.delete(`/orders/${id}/cancel`),
}; 