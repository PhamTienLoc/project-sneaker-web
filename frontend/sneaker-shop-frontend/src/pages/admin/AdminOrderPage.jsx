import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminOrderService } from "../../services/adminOrderService";
import { useForm } from "react-hook-form";

export default function AdminOrderPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: adminOrderService.getAll,
    select: (res) => res.result?.content || [],
  });

  const mutation = useMutation({
    mutationFn: (formData) =>
      adminOrderService.update(editing.id, formData.status),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-orders"]);
      setShowForm(false);
      setEditing(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminOrderService.delete(id),
    onSuccess: () => queryClient.invalidateQueries(["admin-orders"]),
  });

  const { register, handleSubmit, reset } = useForm();

  const openEdit = (item) => {
    setEditing(item);
    reset(item);
    setShowForm(true);
  };
  const onSubmit = (formData) => mutation.mutate(formData);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý Đơn hàng</h1>
      </div>
      {isLoading ? (
        <div>Đang tải...</div>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Khách hàng</th>
              <th className="border px-2 py-1">Trạng thái</th>
              <th className="border px-2 py-1">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) && data.map((item) => (
              <tr key={item.id}>
                <td className="border px-2 py-1">{item.id}</td>
                <td className="border px-2 py-1">{item.username || item.customerName || item.user?.username}</td>
                <td className="border px-2 py-1">{item.status}</td>
                <td className="border px-2 py-1">
                  <button className="text-blue-600 mr-2" onClick={() => openEdit(item)}>
                    Sửa
                  </button>
                  <button className="text-red-600" onClick={() => deleteMutation.mutate(item.id)}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form className="bg-white p-6 rounded shadow w-96" onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-xl font-bold mb-4">Sửa đơn hàng</h2>
            <div className="mb-2">
              <label className="block mb-1">Trạng thái</label>
              <input className="border px-2 py-1 w-full" {...register("status", { required: true })} />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" className="px-3 py-1 bg-gray-300 rounded" onClick={() => setShowForm(false)}>
                Hủy
              </button>
              <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded" disabled={mutation.isPending}>
                {mutation.isPending ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 