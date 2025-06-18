import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminCategoryService } from "../../services/adminCategoryService";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

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
      toast.success(editing ? "Cập nhật danh mục thành công!" : "Thêm danh mục thành công!");
    },
    onError: (error) => {
      toast.error(editing ? "Cập nhật danh mục thất bại!" : "Thêm danh mục thất bại!");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminCategoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-categories"]);
      toast.success("Xóa danh mục thành công!");
    },
    onError: () => {
      toast.error("Xóa danh mục thất bại!");
    }
  });

  const { register, handleSubmit, reset } = useForm();

  const openAdd = () => {
    setEditing(null);
    reset({
      name: '',
      description: '',
      isActive: true
    });
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    reset({
      name: item.name,
      description: item.description || '',
      isActive: item.isActive
    });
    setShowForm(true);
  };

  const onSubmit = (formData) => mutation.mutate(formData);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('vi-VN');
  };

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
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="border px-2 py-1">ID</th>
                <th className="border px-2 py-1">Tên</th>
                <th className="border px-2 py-1">Mô tả</th>
                <th className="border px-2 py-1">Trạng thái</th>
                <th className="border px-2 py-1">Ngày tạo</th>
                <th className="border px-2 py-1">Ngày cập nhật</th>
                <th className="border px-2 py-1">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data) && data.map((item) => (
                <tr key={item.id}>
                  <td className="border px-2 py-1">{item.id}</td>
                  <td className="border px-2 py-1">{item.name}</td>
                  <td className="border px-2 py-1">{item.description || '-'}</td>
                  <td className="border px-2 py-1">
                    <span className={`px-2 py-1 rounded ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="border px-2 py-1">{formatDate(item.createdAt)}</td>
                  <td className="border px-2 py-1">{formatDate(item.updatedAt)}</td>
                  <td className="border px-2 py-1">
                    <div className="flex gap-2">
                      <button 
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        onClick={() => openEdit(item)}
                      >
                        Edit
                      </button>
                      <button 
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        onClick={() => deleteMutation.mutate(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form className="bg-white p-6 rounded shadow w-[500px]" onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-xl font-bold mb-4">{editing ? "Sửa danh mục" : "Thêm danh mục"}</h2>
            <div className="mb-2">
              <label className="block mb-1">Tên danh mục</label>
              <input className="border px-2 py-1 w-full" {...register("name", { required: true })} />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Mô tả</label>
              <textarea className="border px-2 py-1 w-full" {...register("description")} />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Trạng thái</label>
              <select className="border px-2 py-1 w-full" {...register("isActive")}>
                <option value={true}>Hoạt động</option>
                <option value={false}>Không hoạt động</option>
              </select>
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