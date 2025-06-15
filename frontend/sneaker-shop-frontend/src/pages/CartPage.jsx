import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { cartService } from '../services/cartService'
import { imageService } from '../services/imageService'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

console.log('CartPage mounted');

const CartPage = () => {
  const queryClient = useQueryClient()

  const { data: cartData, isLoading, error } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartService.getCartItems(),
  })
  
  const cartItems = cartData?.result?.items || []

  const updateQuantityMutation = useMutation({
    mutationFn: ({ cartItemId, quantity }) => cartService.updateCartItem(cartItemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries(['cart'])
      toast.success('Cập nhật giỏ hàng thành công')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Cập nhật giỏ hàng thất bại')
    }
  })

  const removeItemMutation = useMutation({
    mutationFn: (cartItemId) => cartService.removeFromCart(cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries(['cart'])
      toast.success('Xóa sản phẩm khỏi giỏ hàng thành công')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Xóa sản phẩm khỏi giỏ hàng thất bại')
    }
  })

  const clearCartMutation = useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries(['cart'])
      toast.success('Xóa giỏ hàng thành công')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Xóa giỏ hàng thất bại')
    }
  })

  const handleQuantityChange = (cartItemId, newQuantity) => {
    if (newQuantity < 1) return
    updateQuantityMutation.mutate({ cartItemId, quantity: newQuantity })
  }

  const handleRemoveItem = (cartItemId) => {
    removeItemMutation.mutate(cartItemId)
  }

  const handleClearCart = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
      clearCartMutation.mutate()
    }
  }


  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Có lỗi xảy ra khi tải giỏ hàng</p>
        <button
          onClick={() => queryClient.invalidateQueries(['cart'])}
          className="mt-4 text-primary-600 hover:text-primary-700"
        >
          Thử lại
        </button>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-semibold text-gray-900">Giỏ hàng trống</h2>
        <p className="mt-2 text-gray-600">Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
        <Link
          to="/products"
          className="mt-4 inline-block bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    )
  }

  const totalAmount = cartData?.result?.totalAmount ?? 0
  const totalItems = cartData?.result?.totalItems ?? 0
  

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Giỏ hàng</h1>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {cartItems.map((item) => (
            <li key={item.id} className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-24 w-24">
                  <img
                    src={imageService.getImageUrl(item.image.path)}
                    alt={item.productName}
                    className="h-full w-full object-cover rounded-md"
                  />
                </div>
                <div className="ml-6 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      <Link to={`/products/${item.productId}`} className="hover:text-primary-600">
                        {item.productName}
                      </Link>
                    </h3>
                    <p className="ml-4 text-lg font-medium text-gray-900">
                      {item.price.toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="text-gray-500 hover:text-gray-700"
                        disabled={updateQuantityMutation.isPending}
                      >
                        -
                      </button>
                      <span className="mx-2 text-gray-700">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="text-gray-500 hover:text-gray-700"
                        disabled={updateQuantityMutation.isPending}
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-600 hover:text-red-800"
                      disabled={removeItemMutation.isPending}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={handleClearCart}
                className="text-red-600 hover:text-red-800"
                disabled={clearCartMutation.isPending}
              >
                Xóa giỏ hàng
              </button>
            </div>
            <div className="text-right">
              <p className="text-lg font-medium text-gray-900">
                Tổng cộng: {totalAmount.toLocaleString('vi-VN')}đ
              </p>
              <button
                className="mt-4 w-full bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
                disabled={cartItems.length === 0}
              >
                Thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage 