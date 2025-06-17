import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminBrandService } from "../../services/adminBrandService";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";

export default function AdminBrandPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-brands"],
    queryFn: adminBrandService.getAll,
    select: (res) => res.result?.content || [],
  });

  // Thêm brand
  const mutationCreate = useMutation({
    mutationFn: async (formData) => {
      // 1. Tạo brand
      const brandRes = await adminBrandService.create(formData);
      const brandId = brandRes.result?.id;
      // 2. Upload ảnh nếu có
      if (imageFile && brandId) {
        const form = new FormData();
        form.append("file", imageFile);
        form.append("type", "brand");
        form.append("objectId", brandId);
        await axios.post("/api/images/upload", form);
      }
      return brandRes;
    },
    onSuccess: () => {
      toast.success("Thêm thương hiệu thành công!");
      queryClient.invalidateQueries(["admin-brands"]);
      setShowForm(false);
      setEditing(null);
      reset();
      setImageFile(null);
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
        form.append("file", imageFile);
        form.append("type", "brand");
        form.append("objectId", id);
        await axios.post("/api/images/upload", form);
      }
    },
    onSuccess: () => {
      toast.success("Cập nhật thương hiệu thành công!");
      queryClient.invalidateQueries(["admin-brands"]);
      setShowForm(false);
      setEditing(null);
      reset();
      setImageFile(null);
    },
    onError: () => {
      toast.error("Cập nhật thương hiệu thất bại!");
    },
  });

  const { register, handleSubmit, reset } = useForm();

  const openAdd = () => {
    setEditing(null);
    reset();
    setImageFile(null);
    setShowForm(true);
  };
  const openEdit = (item) => {
    setEditing(item);
    reset(item);
    setImageFile(null);
    setShowForm(true);
  };
  const onSubmit = (formData) => {
    if (editing) {
      mutationUpdate.mutate({ id: editing.id, data: formData, imageFile });
    } else {
      mutationCreate.mutate(formData);
    }
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
                  <button className="text-red-600" /* onClick={() => deleteMutation.mutate(item.id)} */>
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
            <h2 className="text-xl font-bold mb-4">{editing ? "Sửa thương hiệu" : "Thêm thương hiệu"}</h2>
            <div className="mb-2">
              <label className="block mb-1">Tên thương hiệu</label>
              <input className="border px-2 py-1 w-full" {...register("name", { required: true })} />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Ảnh thương hiệu</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" className="px-3 py-1 bg-gray-300 rounded" onClick={() => { setShowForm(false); setEditing(null); }}>
                Hủy
              </button>
              <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded" disabled={mutationCreate.isPending || mutationUpdate.isPending}>
                {(mutationCreate.isPending || mutationUpdate.isPending) ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 