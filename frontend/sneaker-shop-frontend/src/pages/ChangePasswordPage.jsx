import React, { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function ChangePasswordPage() {
  const [form, setForm] = useState({
    oldPassword: '',
    newPassword: ''
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/users/me/change-password', form);
      toast.success('Đổi mật khẩu thành công!');
      setForm({ oldPassword: '', newPassword: '' });
    } catch (e) {
      toast.error('Đổi mật khẩu thất bại!');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Thay đổi mật khẩu</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Mật khẩu cũ</label>
          <input
            className="border px-2 py-1 w-full"
            name="oldPassword"
            type="password"
            value={form.oldPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Mật khẩu mới</label>
          <input
            className="border px-2 py-1 w-full"
            name="newPassword"
            type="password"
            value={form.newPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={saving}>
          {saving ? 'Đang lưu...' : 'Đổi mật khẩu'}
        </button>
      </form>
    </div>
  );
} 