import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminUserService } from "../../services/adminUserService";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const USER_ROLES = {
  ROLE_USER: 'ROLE_USER',
  ROLE_ADMIN: 'ROLE_ADMIN'
};

export default function AdminUserPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: adminUserService.getAll,
    select: (res) => res.result?.content || [],
  });

  const mutation = useMutation({
    mutationFn: (formData) =>
      editing
        ? adminUserService.update(editing.id, formData)
        : adminUserService.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-users"]);
      setShowForm(false);
      setEditing(null);
      toast.success(editing ? "Cập nhật người dùng thành công!" : "Thêm người dùng thành công!");
    },
    onError: () => {
      toast.error(editing ? "Cập nhật người dùng thất bại!" : "Thêm người dùng thất bại!");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminUserService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-users"]);
      toast.success("Xóa người dùng thành công!");
    },
    onError: () => {
      toast.error("Xóa người dùng thất bại!");
    }
  });

  const { register, handleSubmit, reset, watch } = useForm();
  const selectedRoles = watch("roles") || [];

  const openAdd = () => {
    setEditing(null);
    reset({
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      address: '',
      roles: []
    });
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    reset({
      username: item.username || '',
      email: item.email || '',
      firstName: item.firstName || '',
      lastName: item.lastName || '',
      phoneNumber: item.phoneNumber || '',
      address: item.address || '',
      roles: item.roles || []
    });
    setShowForm(true);
  };

  const onSubmit = (formData) => {
    mutation.mutate(formData);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getRoleBadgeColor = (role) => {
    return role === USER_ROLES.ROLE_ADMIN ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý Người dùng</h1>
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
                <th className="border px-2 py-1">Tên đăng nhập</th>
                <th className="border px-2 py-1">Họ và tên</th>
                <th className="border px-2 py-1">Email</th>
                <th className="border px-2 py-1">Số điện thoại</th>
                <th className="border px-2 py-1">Địa chỉ</th>
                <th className="border px-2 py-1">Role</th>
                <th className="border px-2 py-1">Ngày tạo</th>
                <th className="border px-2 py-1">Ngày cập nhật</th>
                <th className="border px-2 py-1">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data) && data.map((item) => (
                <tr key={item.id}>
                  <td className="border px-2 py-1">{item.id}</td>
                  <td className="border px-2 py-1">{item.username}</td>
                  <td className="border px-2 py-1">{`${item.firstName || ''} ${item.lastName || ''}`.trim()}</td>
                  <td className="border px-2 py-1">{item.email}</td>
                  <td className="border px-2 py-1">{item.phoneNumber || '-'}</td>
                  <td className="border px-2 py-1">{item.address || '-'}</td>
                  <td className="border px-2 py-1">
                    <div className="flex flex-wrap gap-1">
                      {item.roles?.map((role, index) => (
                        <span 
                          key={index} 
                          className={`px-2 py-1 rounded text-sm ${getRoleBadgeColor(role)}`}
                        >
                          {role}
                        </span>
                      ))}
                    </div>
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
            <h2 className="text-xl font-bold mb-4">{editing ? "Sửa người dùng" : "Thêm người dùng"}</h2>
            <div className="mb-2">
              <label className="block mb-1">Tên đăng nhập</label>
              <input className="border px-2 py-1 w-full" {...register("username", { required: true })} />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Email</label>
              <input className="border px-2 py-1 w-full" type="email" {...register("email", { required: true })} />
            </div>
            {!editing && (
              <div className="mb-2">
                <label className="block mb-1">Mật khẩu</label>
                <input className="border px-2 py-1 w-full" type="password" {...register("password", { required: !editing })} />
              </div>
            )}
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className="block mb-1">Họ</label>
                <input className="border px-2 py-1 w-full" {...register("firstName")} />
              </div>
              <div>
                <label className="block mb-1">Tên</label>
                <input className="border px-2 py-1 w-full" {...register("lastName")} />
              </div>
            </div>
            <div className="mb-2">
              <label className="block mb-1">Số điện thoại</label>
              <input className="border px-2 py-1 w-full" {...register("phoneNumber")} />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Địa chỉ</label>
              <textarea className="border px-2 py-1 w-full" {...register("address")} />
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