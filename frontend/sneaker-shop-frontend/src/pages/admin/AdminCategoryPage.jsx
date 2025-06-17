import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminCategoryService } from "../../services/adminCategoryService";
import { useForm } from "react-hook-form";

export default function AdminCategoryPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: adminCategoryService.getAll,
    select: (res) => res.result?.content || [],
  });

  const mutation = useMutation({
    mutationFn: (formData) =>
      editing
        ? adminCategoryService.update(editing.id, formData)
        : adminCategoryService.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-categories"]);
      setShowForm(false);
      setEditing(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminCategoryService.delete(id),
    onSuccess: () => queryClient.invalidateQueries(["admin-categories"]),
  });

  const { register, handleSubmit, reset } = useForm();

  const openAdd = () => {
    setEditing(null);
    reset({});
    setShowForm(true);
  };
  const openEdit = (item) => {
    setEditing(item);
    reset(item);
    setShowForm(true);
  };
  const onSubmit = (formData) => mutation.mutate(formData);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý Danh mục</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={openAdd}>
          Thêm mới
        </button>
      </div>
      {isLoading ? (
        <div>Đang tải...</div>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Tên</th>
              <th className="border px-2 py-1">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) && data.map((item) => (
              <tr key={item.id}>
                <td className="border px-2 py-1">{item.id}</td>
                <td className="border px-2 py-1">{item.name}</td>
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
            <h2 className="text-xl font-bold mb-4">{editing ? "Sửa danh mục" : "Thêm danh mục"}</h2>
            <div className="mb-2">
              <label className="block mb-1">Tên danh mục</label>
              <input className="border px-2 py-1 w-full" {...register("name", { required: true })} />
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