import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminBrandService } from "../../services/adminBrandService";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import { imageService } from "../../services/imageService";

export default function AdminBrandPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-brands"],
    queryFn: adminBrandService.getAll,
    select: (res) => res.result?.content || [],
  });

  // Thêm brand
  const mutationCreate = useMutation({
    mutationFn: async (data) => {
      // 1. Create brand with plain JS object
      const brandRes = await adminBrandService.create(data);
      const brandId = brandRes.result?.id;
      // 2. Upload image if provided
      if (imageFile && brandId) {
        const form = new FormData();
        form.append("file", imageFile);
        form.append("type", "brand");
        form.append("objectId", brandId);
        await axios.post("/api/images/upload", form, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`
          },
        });
      }
      return brandRes;
    },
    onSuccess: () => {
      toast.success("Thêm thương hiệu thành công!");
      queryClient.invalidateQueries(["admin-brands"]);
      setShowForm(false);
      setEditing(null);
      reset({
        name: '',
        description: '',
        isActive: true
      });
      setImageFile(null);
      setPreviewUrl(null);
    },
    onError: () => {
      toast.error("Thêm thương hiệu thất bại!");
    },
  });

  // Sửa brand
  const mutationUpdate = useMutation({
    mutationFn: async ({ id, data, imageFile }) => {
      // 1. Update brand
      await adminBrandService.update(id, data);
      // 2. Nếu có ảnh mới, upload ảnh
      if (imageFile) {
        const form = new FormData();
        form.append("files", imageFile);
        form.append("type", "brand");
        form.append("objectId", id);
        await axios.post("/api/images/upload", form, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`
          },
        });
      }
    },
    onSuccess: () => {
      toast.success("Cập nhật thương hiệu thành công!");
      queryClient.invalidateQueries(["admin-brands"]);
      setShowForm(false);
      setEditing(null);
      reset({
        name: '',
        description: '',
        isActive: true
      });
      setImageFile(null);
      setPreviewUrl(null);
    },
    onError: () => {
      toast.error("Cập nhật thương hiệu thất bại!");
    },
  });

  const { register, handleSubmit, reset } = useForm();

  const openAdd = () => {
    setEditing(null);
    reset({
      name: '',
      description: '',
      isActive: true
    });
    setImageFile(null);
    setPreviewUrl(null);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    reset({
      name: item.name,
      description: item.description || '',
      isActive: item.isActive
    });
    setImageFile(null);
    setPreviewUrl(item.images?.[0] ? imageService.getImageUrl(item.images[0].path) : null);
    setShowForm(true);
  };

  const onSubmit = (formData) => {
    if (editing) {
      mutationUpdate.mutate({ id: editing.id, data: formData, imageFile });
    } else {
      mutationCreate.mutate(formData);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý Thương hiệu</h1>
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
                <th className="border px-2 py-1">Ảnh</th>
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
                  <td className="border px-2 py-1">
                    {item.images?.[0] && (
                      <img 
                        src={imageService.getImageUrl(item.images[0].path)} 
                        alt={item.name}
                        className="w-16 h-16 object-cover"
                      />
                    )}
                  </td>
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
            <h2 className="text-xl font-bold mb-4">{editing ? "Sửa thương hiệu" : "Thêm thương hiệu"}</h2>
            <div className="mb-2">
              <label className="block mb-1">Tên thương hiệu</label>
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
            <div className="mb-2">
              <label className="block mb-1">Ảnh thương hiệu</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mb-2"
              />
              {previewUrl && (
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-32 h-32 object-cover border rounded"
                />
              )}
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
                disabled={mutationCreate.isPending || mutationUpdate.isPending}
              >
                {(mutationCreate.isPending || mutationUpdate.isPending) ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 