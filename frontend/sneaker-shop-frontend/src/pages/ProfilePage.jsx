import React, { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const res = await api.get('/users/me');
        setUser(res.result);
        setForm({
          firstName: res.result.firstName || '',
          lastName: res.result.lastName || '',
          email: res.result.email || '',
          phoneNumber: res.result.phoneNumber || '',
          address: res.result.address || ''
        });
      } catch (e) {
        toast.error('Không thể tải thông tin người dùng');
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/users/me', form);
      toast.success('Cập nhật thông tin thành công!');
    } catch (e) {
      toast.error('Cập nhật thất bại!');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Đang tải...</div>;

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Thông tin cá nhân</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Họ</label>
          <input className="border px-2 py-1 w-full" name="firstName" value={form.firstName} onChange={handleChange} />
        </div>
        <div>
          <label className="block mb-1">Tên</label>
          <input className="border px-2 py-1 w-full" name="lastName" value={form.lastName} onChange={handleChange} />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input className="border px-2 py-1 w-full" name="email" value={form.email} onChange={handleChange} />
        </div>
        <div>
          <label className="block mb-1">Số điện thoại</label>
          <input className="border px-2 py-1 w-full" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
        </div>
        <div>
          <label className="block mb-1">Địa chỉ</label>
          <input className="border px-2 py-1 w-full" name="address" value={form.address} onChange={handleChange} />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={saving}>
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </form>
    </div>
  );
} 