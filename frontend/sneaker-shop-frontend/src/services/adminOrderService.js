import api from './api';

export const adminOrderService = {
  getAll: () => api.get('/orders/admin/all'),
  getById: (id) => api.get(`/orders/${id}`),
  update: (id, data) => api.put(`/orders/${id}`, data),
  delete: (id) => api.delete(`/orders/${id}/cancel`),
}; 