import React, { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await api.get('/orders/my-orders');
      console.log('Order API response:', res);
      let ordersArr = [];
      if (Array.isArray(res.result)) {
        ordersArr = res.result;
      } else if (Array.isArray(res.result?.content)) {
        ordersArr = res.result.content;
      }
      setOrders(ordersArr);
    } catch (e) {
      toast.error('Không thể tải lịch sử đơn hàng');
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(orderId) {
    if (!window.confirm('Bạn chắc chắn muốn hủy đơn này?')) return;
    setCancelling(orderId);
    try {
      await api.delete(`/orders/me/${orderId}/cancel`);
      toast.success('Đã hủy đơn hàng!');
      fetchOrders();
    } catch (e) {
      toast.error('Hủy đơn thất bại!');
    } finally {
      setCancelling(null);
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-green-100 text-green-800',
      SHIPPING: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <div className="p-8">Đang tải...</div>;

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Lịch sử mua hàng</h1>
      {orders.length === 0 ? (
        <div>Bạn chưa có đơn hàng nào.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="border px-2 py-1">ID</th>
                <th className="border px-2 py-1">Trạng thái</th>
                <th className="border px-2 py-1">Ngày tạo</th>
                <th className="border px-2 py-1">Tổng tiền</th>
                <th className="border px-2 py-1">Sản phẩm</th>
                <th className="border px-2 py-1">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(orders) && orders.map(order => (
                <tr key={order.id}>
                  <td className="border px-2 py-1 text-center">{order.id}</td>
                  <td className="border px-2 py-1 text-center">
                    <span className={`px-2 py-1 rounded ${getStatusColor(order.status)}`}>{order.status}</span>
                  </td>
                  <td className="border px-2 py-1 text-center">{formatDate(order.createdAt)}</td>
                  <td className="border px-2 py-1 text-center">{formatPrice(order.totalAmount)}</td>
                  <td className="border px-2 py-1">
                    <ul className="list-disc ml-4">
                      {order.items?.map(item => (
                        <li key={item.id}>{item.productName} x {item.quantity}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {order.status !== 'CANCELLED' && (
                      <button
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        onClick={() => handleCancel(order.id)}
                        disabled={cancelling === order.id}
                      >
                        {cancelling === order.id ? 'Đang hủy...' : 'Hủy đơn'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 