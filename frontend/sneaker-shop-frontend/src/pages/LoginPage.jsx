import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

const LoginPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [errors, setErrors] = useState({})

  const loginMutation = useMutation({
    mutationFn: (data) => authService.login(data.username, data.password),
    onSuccess: (data) => {
      console.log('Login successful, user data:', data)
      
      // Check if we have the token
      if (!data.token) {
        console.error('No token in user data:', data)
        toast.error('Đăng nhập thất bại: Không nhận được token')
        return
      }

      toast.success('Đăng nhập thành công')
      
      // Verify the token is set in axios headers
      const user = authService.getCurrentUser()
      if (!user?.token) {
        console.error('Token not properly set after login')
        toast.error('Đăng nhập thất bại: Lỗi xác thực')
        return
      }

      // Lấy roles từ response (ưu tiên roles trong data.result, nếu không có thì lấy từ data.roles hoặc user trong localStorage)
      let roles = [];
      if (Array.isArray(data.result?.roles)) {
        roles = data.result.roles;
      } else if (Array.isArray(data.roles)) {
        roles = data.roles;
      } else {
        if (user && Array.isArray(user.roles)) {
          roles = user.roles;
        }
      }
      console.log('Login redirect debug:', { data, roles });
      if (roles.includes('ROLE_ADMIN')) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    },
    onError: (error) => {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      
      const errorMessage = error.response?.data?.message || error.message || 'Đăng nhập thất bại'
      toast.error(errorMessage)
      setErrors({
        submit: errorMessage
      })
    }
  })

  const validateForm = () => {
    const newErrors = {}
    if (!formData.username) {
      newErrors.username = 'Vui lòng nhập tên đăng nhập'
    }
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      console.log('Submitting login form with:', { username: formData.username })
      loginMutation.mutate(formData)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Đăng nhập
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Hoặc{' '}
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
            đăng ký tài khoản mới
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {errors.submit && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {errors.submit}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Tên đăng nhập
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.username ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                />
                {errors.username && (
                  <p className="mt-2 text-sm text-red-600">{errors.username}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                  Quên mật khẩu?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loginMutation.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage 