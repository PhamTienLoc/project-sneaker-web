import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cartService } from '../services/cartService'
import { orderService } from '../services/orderService'
import { imageService } from '../services/imageService'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const paymentMethods = [
  { value: 'COD', label: 'Thanh toán khi nhận hàng' },
  { value: 'MOMO', label: 'Momo' },
  { value: 'VNPAY', label: 'VNPay' },
]

const OrderPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: cartData, isLoading, error } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartService.getCartItems(),
  })
  const cartItems = cartData?.result?.items || []
  const totalAmount = cartData?.result?.totalAmount ?? 0

  // Thông tin giao hàng
  const [shippingAddress, setShippingAddress] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [note, setNote] = useState('')

  const createOrderMutation = useMutation({
    mutationFn: (orderData) => orderService.createOrder(orderData),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['cart'])
      toast.success('Đặt hàng thành công!')
      navigate('/thank-you')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Đặt hàng thất bại')
    }
  })

  const handlePlaceOrder = (e) => {
    e.preventDefault()
    if (!shippingAddress) {
      toast.error('Vui lòng nhập địa chỉ giao hàng')
      return
    }
    if (!phoneNumber) {
      toast.error('Vui lòng nhập số điện thoại')
      return
    }
    if (!email) {
      toast.error('Vui lòng nhập email')
      return
    }
    if (cartItems.length === 0) {
      toast.error('Giỏ hàng trống')
      return
    }
    createOrderMutation.mutate({
      shippingAddress,
      phoneNumber,
      email,
      paymentMethod,
      note,
    })
  }

  if (isLoading) return <LoadingSpinner />
  if (error) return <div className="text-red-600">Lỗi tải giỏ hàng</div>
  if (cartItems.length === 0) {
    return <div className="text-center py-8">Giỏ hàng trống</div>
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Xác nhận đơn hàng</h1>
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="font-semibold mb-4">Thông tin giao hàng</h2>
          <label className="block mb-2">Địa chỉ giao hàng</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 mb-4"
            value={shippingAddress}
            onChange={e => setShippingAddress(e.target.value)}
            placeholder="Nhập địa chỉ giao hàng"
            required
          />
          <label className="block mb-2">Số điện thoại</label>
          <input
            type="tel"
            className="w-full border rounded px-3 py-2 mb-4"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            placeholder="Nhập số điện thoại"
            required
          />
          <label className="block mb-2">Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2 mb-4"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Nhập email"
            required
          />
          <label className="block mb-2">Ghi chú (tuỳ chọn)</label>
          <textarea
            className="w-full border rounded px-3 py-2 mb-4"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Ghi chú cho đơn hàng"
          />
          <h2 className="font-semibold mb-4">Phương thức thanh toán</h2>
          {paymentMethods.map(method => (
            <label key={method.value} className="flex items-center mb-2">
              <input
                type="radio"
                name="paymentMethod"
                value={method.value}
                checked={paymentMethod === method.value}
                onChange={() => setPaymentMethod(method.value)}
                className="mr-2"
              />
              {method.label}
            </label>
          ))}
        </div>
        <div>
          <h2 className="font-semibold mb-4">Sản phẩm trong đơn hàng</h2>
          <ul className="divide-y divide-gray-200 mb-4">
            {cartItems.map(item => (
              <li key={item.id} className="flex items-center py-3">
                <img
                  src={imageService.getImageUrl(item.image.path)}
                  alt={item.productName}
                  className="w-16 h-16 object-cover rounded mr-4"
                />
                <div className="flex-1">
                  <div className="font-medium">{item.productName}</div>
                  <div className="text-sm text-gray-500">Màu: {item.color} | Size: {item.size}</div>
                  <div className="text-sm">Số lượng: {item.quantity}</div>
                </div>
                <div className="font-semibold ml-4">{item.price.toLocaleString('vi-VN')}đ</div>
              </li>
            ))}
          </ul>
          <div className="text-right font-bold text-lg mb-4">
            Tổng cộng: {totalAmount.toLocaleString('vi-VN')}đ
          </div>
          <button
            type="submit"
            className="w-full bg-primary-600 text-white py-3 rounded hover:bg-primary-700 font-semibold"
            disabled={createOrderMutation.isPending}
          >
            {createOrderMutation.isPending ? 'Đang đặt hàng...' : 'Đặt hàng'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default OrderPage 