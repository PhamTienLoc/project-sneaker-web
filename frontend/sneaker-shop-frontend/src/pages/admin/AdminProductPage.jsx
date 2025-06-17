import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminProductService } from "../../services/adminProductService";
import { adminBrandService } from "../../services/adminBrandService";
import { adminCategoryService } from "../../services/adminCategoryService";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";

export default function AdminProductPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [colorInput, setColorInput] = useState("");
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  // Lấy danh sách sản phẩm
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: adminProductService.getAll,
    select: (res) => res.result?.content || [],
  });

  // Lấy danh sách brand
  const { data: brands = [] } = useQuery({
    queryKey: ["admin-brands"],
    queryFn: adminBrandService.getAll,
    select: (res) => res.result?.content || [],
  });

  // Lấy danh sách category
  const { data: categories = [] } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: adminCategoryService.getAll,
    select: (res) => res.result?.content || [],
  });

  // Giả sử size cố định, bạn có thể lấy từ API nếu muốn
  useEffect(() => {
    setSizes(["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"]);
  }, []);

  // Danh sách màu sắc cố định
  const COLOR_OPTIONS = [
    "Đỏ", "Xanh", "Vàng", "Đen", "Trắng", "Cam", "Tím", "Hồng", "Nâu", "Xám", "Xanh lá", "Xanh dương"
  ];
  // Mapping tên màu sang mã màu
  const COLOR_MAP = {
    "Đỏ": "#ff0000",
    "Xanh": "#008000",
    "Vàng": "#ffff00",
    "Đen": "#000000",
    "Trắng": "#ffffff",
    "Cam": "#ffa500",
    "Tím": "#800080",
    "Hồng": "#ff69b4",
    "Nâu": "#8b4513",
    "Xám": "#808080",
    "Xanh lá": "#00ff00",
    "Xanh dương": "#0000ff"
  };

  // Thêm sản phẩm
  const mutationCreate = useMutation({
    mutationFn: async (formData) => {
      try {
        // 1. Tạo sản phẩm trước (không có ảnh)
        console.log('Creating product with data:', formData);
        const productRes = await adminProductService.create(formData);
        console.log('Product created:', productRes);
        const productId = productRes.result?.id;
        
        // 2. Upload ảnh nếu có
        if (imageFile && productId) {
          try {
            console.log('Uploading image for product:', productId);
            await adminProductService.uploadImage(productId, imageFile);
            console.log('Image uploaded successfully');
          } catch (error) {
            console.error('Error uploading image:', {
              error,
              response: error.response?.data,
              status: error.response?.status,
              headers: error.response?.headers
            });
            toast.error('Lỗi upload ảnh: ' + (error.response?.data?.message || error.message || 'Không xác định'));
            throw error;
          }
        }
        
        return productRes;
      } catch (error) {
        console.error('Error in create mutation:', {
          error,
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers
        });
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Thêm sản phẩm thành công!");
      queryClient.invalidateQueries(["admin-products"]);
      setShowForm(false);
      reset();
      setImageFile(null);
      setColors([]);
      setSelectedSizes([]);
      setSelectedCategories([]);
      setSelectedBrand("");
      setEditingProduct(null);
    },
    onError: (error) => {
      console.error('Error creating product:', {
        error,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      toast.error("Thêm sản phẩm thất bại: " + (error.response?.data?.message || error.message || 'Không xác định'));
    },
  });

  // Sửa sản phẩm
  const mutationUpdate = useMutation({
    mutationFn: async ({ id, data, imageFile }) => {
      try {
        // 1. Upload ảnh mới nếu có (vì đã có id)
        if (imageFile) {
          try {
            console.log('Uploading image for product:', id);
            await adminProductService.uploadImage(id, imageFile);
            console.log('Image uploaded successfully');
          } catch (error) {
            console.error('Error uploading image:', {
              error,
              response: error.response?.data,
              status: error.response?.status,
              headers: error.response?.headers
            });
            toast.error('Lỗi upload ảnh: ' + (error.response?.data?.message || error.message || 'Không xác định'));
            throw error;
          }
        }
        
        // 2. Update sản phẩm
        console.log('Updating product:', { id, data });
        await adminProductService.update(id, data);
        console.log('Product updated successfully');
      } catch (error) {
        console.error('Error in update mutation:', {
          error,
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers
        });
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Cập nhật sản phẩm thành công!");
      queryClient.invalidateQueries(["admin-products"]);
      setShowForm(false);
      setEditingProduct(null);
      reset();
      setImageFile(null);
      setColors([]);
      setSelectedSizes([]);
      setSelectedCategories([]);
      setSelectedBrand("");
    },
    onError: (error) => {
      console.error('Error updating product:', {
        error,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      toast.error("Cập nhật sản phẩm thất bại: " + (error.response?.data?.message || error.message || 'Không xác định'));
    },
  });

  const { register, handleSubmit, reset } = useForm();

  // Xử lý chọn size
  const handleSelectSize = (e) => {
    const value = e.target.value;
    setSelectedSizes(
      selectedSizes.includes(value)
        ? selectedSizes.filter((s) => s !== value)
        : [...selectedSizes, value]
    );
  };

  // Xử lý chọn danh mục
  const handleSelectCategory = (e) => {
    const value = e.target.value;
    setSelectedCategories(
      selectedCategories.includes(value)
        ? selectedCategories.filter((c) => c !== value)
        : [...selectedCategories, value]
    );
  };

  // Mở form thêm mới
  const openAdd = () => {
    setEditingProduct(null);
    reset();
    setSelectedBrand("");
    setSelectedSizes([]);
    setColors([]);
    setSelectedCategories([]);
    setImageFile(null);
    setShowForm(true);
  };

  // Mở form sửa
  const openEdit = (product) => {
    setEditingProduct(product);
    reset({
      name: product.name,
      description: product.description,
      price: product.price,
    });
    setSelectedBrand(product.brand?.id || "");
    setSelectedSizes(product.sizes || []);
    setColors(product.colors || []);
    setSelectedCategories(product.categories?.map(c => String(c.id)) || []);
    setImageFile(null);
    setShowForm(true);
  };

  // Xử lý submit form
  const onSubmit = (formData) => {
    if (editingProduct) {
      mutationUpdate.mutate({
        id: editingProduct.id,
        data: {
          ...formData,
          brandId: selectedBrand,
          sizes: selectedSizes,
          colors,
          categoryIds: selectedCategories,
        },
        imageFile,
      });
    } else {
      mutationCreate.mutate({
        ...formData,
        brandId: selectedBrand,
        sizes: selectedSizes,
        colors,
        categoryIds: selectedCategories,
        imageFile,
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý Sản phẩm</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={openAdd}
        >
          Thêm mới
        </button>
      </div>
      {/* Bảng sản phẩm */}
      {isLoading ? (
        <div>Đang tải...</div>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Ảnh</th>
              <th className="border px-2 py-1">Tên sản phẩm</th>
              <th className="border px-2 py-1">Giá</th>
              <th className="border px-2 py-1">Size</th>
              <th className="border px-2 py-1">Màu sắc</th>
              <th className="border px-2 py-1">Hãng</th>
              <th className="border px-2 py-1">Danh mục</th>
              <th className="border px-2 py-1">Trạng thái</th>
              <th className="border px-2 py-1">Ngày tạo</th>
              <th className="border px-2 py-1">Ngày cập nhật</th>
              <th className="border px-2 py-1">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) && data.map((p) => (
              <tr key={p.id}>
                <td className="border px-2 py-1 text-center">{p.id}</td>
                <td className="border px-2 py-1 text-center">
                  {p.images && p.images.length > 0 ? (
                    <img
                      src={`/api/images/download?path=${encodeURIComponent(p.images[0].path)}`}
                      alt={p.name}
                      className="w-16 h-16 object-cover mx-auto rounded"
                    />
                  ) : (
                    <span className="text-gray-400">Không có ảnh</span>
                  )}
                </td>
                <td className="border px-2 py-1 font-semibold">{p.name}</td>
                <td className="border px-2 py-1">{p.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                <td className="border px-2 py-1">{Array.isArray(p.sizes) ? p.sizes.join(', ') : ''}</td>
                <td className="border px-2 py-1">{Array.isArray(p.colors) ? p.colors.join(', ') : ''}</td>
                <td className="border px-2 py-1">{p.brand?.name}</td>
                <td className="border px-2 py-1">{Array.isArray(p.categories) ? p.categories.map(c => c.name).join(', ') : ''}</td>
                <td className="border px-2 py-1">{p.isActive ? 'Hoạt động' : 'Ẩn'}</td>
                <td className="border px-2 py-1">{p.createdAt ? new Date(p.createdAt).toLocaleString('vi-VN') : ''}</td>
                <td className="border px-2 py-1">{p.updatedAt ? new Date(p.updatedAt).toLocaleString('vi-VN') : ''}</td>
                <td className="border px-2 py-1">
                  <button
                    className="text-blue-600 mr-2"
                    onClick={() => openEdit(p)}
                  >
                    Sửa
                  </button>
                  <button
                    className="text-red-600"
                    // onClick={() => deleteMutation.mutate(p.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Form thêm/sửa sản phẩm */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form
            className="bg-white p-6 rounded shadow w-[500px] max-h-[90vh] overflow-y-auto"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h2 className="text-xl font-bold mb-4">{editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}</h2>
            <div className="mb-2">
              <label className="block mb-1">Tên sản phẩm</label>
              <input className="border px-2 py-1 w-full" {...register("name", { required: true })} />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Mô tả</label>
              <textarea className="border px-2 py-1 w-full" {...register("description", { required: true })} />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Giá</label>
              <input className="border px-2 py-1 w-full" type="number" {...register("price", { required: true })} />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Hãng</label>
              <select
                className="border px-2 py-1 w-full"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                required
              >
                <option value="">-- Chọn hãng --</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <label className="block mb-1">Size</label>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <label key={size} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      value={size}
                      checked={selectedSizes.includes(size)}
                      onChange={handleSelectSize}
                    />
                    {size}
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-2">
              <label className="block mb-1">Màu sắc</label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((color) => (
                  <label key={color} className={`flex items-center gap-1 px-2 py-1 rounded cursor-pointer ${colors.includes(color) ? 'bg-blue-200' : 'bg-gray-100'}`}>
                    <input
                      type="checkbox"
                      value={color}
                      checked={colors.includes(color)}
                      onChange={() => {
                        setColors(colors.includes(color)
                          ? colors.filter(c => c !== color)
                          : [...colors, color]);
                      }}
                    />
                    {/* Vòng tròn màu */}
                    <div
                      className="w-4 h-4 rounded-full border border-gray-300"
                      title={color}
                      style={{ backgroundColor: COLOR_MAP[color] || '#fff' }}
                    ></div>
                    <span>{color}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-2">
              <label className="block mb-1">Danh mục</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      value={cat.id}
                      checked={selectedCategories.includes(String(cat.id))}
                      onChange={handleSelectCategory}
                    />
                    {cat.name}
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-2">
              <label className="block mb-1">Ảnh sản phẩm</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                className="px-3 py-1 bg-gray-300 rounded"
                onClick={() => { setShowForm(false); setEditingProduct(null); }}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-blue-600 text-white rounded"
                disabled={mutationCreate.isPending || mutationUpdate.isPending}
              >
                {(mutationCreate.isPending || mutationUpdate.isPending) ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 