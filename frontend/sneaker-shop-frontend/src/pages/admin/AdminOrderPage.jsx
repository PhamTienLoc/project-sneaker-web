import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminOrderService } from "../../services/adminOrderService";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  SHIPPING: 'SHIPPING',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
};

const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED'
};

const PAYMENT_METHOD = {
  COD: 'COD',
  BANK_TRANSFER: 'BANK_TRANSFER',
  CREDIT_CARD: 'CREDIT_CARD'
};

export default function AdminOrderPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: adminOrderService.getAll,
    select: (res) => res.result?.content || [],
  });

  const mutation = useMutation({
    mutationFn: (formData) => {
      console.log('Mutation data:', formData);
      return adminOrderService.update(editing.id, formData);
    },
    onSuccess: (response) => {
      console.log('API Response:', response);
      queryClient.setQueryData(["admin-orders"], (oldData) => {
        const updatedContent = oldData.result.content.map(order => 
          order.id === editing.id ? { ...order, ...response.result } : order
        );
        return {
          ...oldData,
          result: {
            ...oldData.result,
            content: updatedContent
          }
        };
      });
      queryClient.invalidateQueries(["admin-orders"]);
      setShowForm(false);
      setEditing(null);
      toast.success("Cập nhật đơn hàng thành công!");
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast.error("Cập nhật đơn hàng thất bại!");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminOrderService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-orders"]);
      toast.success("Xóa đơn hàng thành công!");
    },
    onError: () => {
      toast.error("Xóa đơn hàng thất bại!");
    }
  });

  const { register, handleSubmit, reset } = useForm();

  const openEdit = (item) => {
    console.log('Opening edit for item:', item);
    setEditing(item);
    reset({
      shippingAddress: item.shippingAddress || '',
      phoneNumber: item.phoneNumber || '',
      email: item.email || '',
      paymentMethod: item.paymentMethod || PAYMENT_METHOD.COD,
      paymentStatus: item.paymentStatus || PAYMENT_STATUS.PENDING,
      status: item.status || ORDER_STATUS.PENDING,
      note: item.note || ''
    });
    setShowForm(true);
  };

  const openDetails = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const onSubmit = (formData) => {
    console.log('Form data before submission:', formData);
    const data = {
      shippingAddress: formData.shippingAddress,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      paymentMethod: formData.paymentMethod,
      paymentStatus: formData.paymentStatus,
      status: formData.status,
      note: formData.note
    };
    console.log('Data being sent to API:', data);
    mutation.mutate(data);
  };

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
      [ORDER_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
      [ORDER_STATUS.CONFIRMED]: 'bg-green-100 text-green-800',
      [ORDER_STATUS.SHIPPING]: 'bg-purple-100 text-purple-800',
      [ORDER_STATUS.DELIVERED]: 'bg-green-100 text-green-800',
      [ORDER_STATUS.CANCELLED]: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      [PAYMENT_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
      [PAYMENT_STATUS.PAID]: 'bg-green-100 text-green-800',
      [PAYMENT_STATUS.FAILED]: 'bg-red-100 text-red-800',
      [PAYMENT_STATUS.REFUNDED]: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý Đơn hàng</h1>
      </div>
      {isLoading ? (
        <div>Đang tải...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="border px-2 py-1">ID</th>
                <th className="border px-2 py-1">Khách hàng</th>
                <th className="border px-2 py-1">Trạng thái</th>
                <th className="border px-2 py-1">Thanh toán</th>
                <th className="border px-2 py-1">Ngày tạo</th>
                <th className="border px-2 py-1">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data) && data.map((item) => (
                <tr key={item.id}>
                  <td className="border px-2 py-1">{item.id}</td>
                  <td className="border px-2 py-1">{item.username || item.customerName || item.user?.username}</td>
                  <td className="border px-2 py-1">
                    <span className={`px-2 py-1 rounded ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="border px-2 py-1">
                    <span className={`px-2 py-1 rounded ${getPaymentStatusColor(item.paymentStatus)}`}>
                      {item.paymentStatus}
                    </span>
                  </td>
                  <td className="border px-2 py-1">{formatDate(item.createdAt)}</td>
                  <td className="border px-2 py-1">
                    <div className="flex gap-2">
                      <button 
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        onClick={() => openDetails(item)}
                      >
                        Details
                      </button>
                      <button 
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        onClick={() => openEdit(item)}
                        disabled={item.status === 'CANCELLED'}
                      >
                        Edit
                      </button>
                      <button 
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        onClick={async () => {
                          if (item.status === 'CANCELLED') return;
                          if (window.confirm('Are you sure you want to cancel this order?')) {
                            await deleteMutation.mutateAsync(item.id);
                          }
                        }}
                        disabled={item.status === 'CANCELLED'}
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-[800px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Chi tiết đơn hàng #{selectedOrder.id}</h2>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowDetails(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="font-semibold mb-2">Thông tin khách hàng</h3>
                <p>Họ tên: {selectedOrder.username || selectedOrder.customerName || selectedOrder.user?.username}</p>
                <p>Email: {selectedOrder.email}</p>
                <p>Số điện thoại: {selectedOrder.phoneNumber}</p>
                <p>Địa chỉ: {selectedOrder.shippingAddress}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Thông tin đơn hàng</h3>
                <p>Trạng thái: <span className={`px-2 py-1 rounded ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span></p>
                <p>Thanh toán: <span className={`px-2 py-1 rounded ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>{selectedOrder.paymentStatus}</span></p>
                <p>Phương thức: {selectedOrder.paymentMethod}</p>
                <p>Ngày tạo: {formatDate(selectedOrder.createdAt)}</p>
                <p>Ghi chú: {selectedOrder.note || '-'}</p>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Sản phẩm</h3>
              <table className="min-w-full border">
                <thead>
                  <tr>
                    <th className="border px-2 py-1">Sản phẩm</th>
                    <th className="border px-2 py-1">Số lượng</th>
                    <th className="border px-2 py-1">Đơn giá</th>
                    <th className="border px-2 py-1">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((item, index) => {
                    console.log('Detail Item:', item);
                    return (
                      <tr key={index}>
                        <td className="border px-2 py-1">{item.product?.name || item.productName}</td>
                        <td className="border px-2 py-1">{item.quantity}</td>
                        <td className="border px-2 py-1">{formatPrice(item.price)}</td>
                        <td className="border px-2 py-1">{formatPrice(item.price * item.quantity)}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="border px-2 py-1 text-right font-semibold">Tổng cộng:</td>
                    <td className="border px-2 py-1 font-semibold">{formatPrice(selectedOrder.totalAmount)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form className="bg-white p-6 rounded shadow w-[500px]" onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-xl font-bold mb-4">Cập nhật đơn hàng</h2>
            <div className="mb-2">
              <label className="block mb-1">Địa chỉ giao hàng</label>
              <input className="border px-2 py-1 w-full" {...register("shippingAddress", { required: true })} />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Số điện thoại</label>
              <input className="border px-2 py-1 w-full" {...register("phoneNumber", { required: true })} />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Email</label>
              <input className="border px-2 py-1 w-full" type="email" {...register("email", { required: true })} />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Phương thức thanh toán</label>
              <select className="border px-2 py-1 w-full" {...register("paymentMethod", { required: true })}>
                {Object.entries(PAYMENT_METHOD).map(([key, value]) => (
                  <option key={key} value={value}>{value}</option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <label className="block mb-1">Trạng thái thanh toán</label>
              <select className="border px-2 py-1 w-full" {...register("paymentStatus", { required: true })}>
                {Object.entries(PAYMENT_STATUS).map(([key, value]) => (
                  <option key={key} value={value}>{value}</option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <label className="block mb-1">Trạng thái đơn hàng</label>
              <select 
                className="border px-2 py-1 w-full" 
                {...register("status", { required: true })}
                defaultValue={editing?.status}
              >
                {Object.entries(ORDER_STATUS).map(([key, value]) => (
                  <option key={key} value={value}>{value}</option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <label className="block mb-1">Ghi chú</label>
              <textarea className="border px-2 py-1 w-full" {...register("note")} />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button 
                type="button" 
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors" 
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors" 
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 